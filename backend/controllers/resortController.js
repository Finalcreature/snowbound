const db = require("../models/dbModel");
const format = require("pg-format");

const getResortByBame = async (req, res) => {
  const { name } = req.params;

  if (!name) return res.status(400).json({ message: "name not provided" });

  try {
    const { rows } = await db.query("SELECT * FROM resort WHERE name = $1", [
      name,
    ]);
    const { rows: rows2 } = await db.query(
      format("select * from img where owner = %L", name)
    );
    const answer = [rows, rows2];
    console.log(rows, rows2);
    res.status(200).json(answer);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: err.message });
  }
};

const getMultipleResortByBame = async (req, res) => {
  const { names } = req.body;

  if (!names) return res.status(400).json({ message: "names not provided" });

  try {
    const { rows } = await db.query(
      format(`SELECT * FROM resort WHERE name in %L`, [names])
    );
    const { rows: rows2 } = await db.query(
      format("select * from img where owner in %L", [names])
    );
    const answer = [rows2, rows];
    console.log(rows);
    console.log(rows2);
    res.status(200).json(answer);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: err.message });
  }
};
const getResortByCountry = async (req, res) => {
  const country = req.params.country;
  console.log(country);

  if (!country) return res.status(400).json({ message: "name not provided" });

  try {
    const { rows } = await db.query(
      "SELECT * FROM resort WHERE country_id = $1",
      [country]
    );

    console.log("Rows:", rows);
    res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: err.message });
  }
};
const deleteResortByBame = async (req, res) => {
  const { name } = req.params;

  if (!name) return res.status(400).json({ message: "name not provided" });

  try {
    const { rows } = await db.query("DELETE FROM resort WHERE name = $1", [
      name,
    ]);

    console.log(rows);
    res.status(200).json("DELETED", rows);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: err.message });
  }
};
const createResort = async (req, res) => {
  const resort = req.body.resort;
  const imgs = req.body.img;
  if (!resort) return res.status(400).json({ message: "names not provided" });
  try {
    const { rows } = await db.query(
      format(
        "INSERT INTO resort (%I) VALUES (%L)",
        Object.keys(resort),
        Object.values(resort)
      )
    );
    console.log(rows);
    const promises = imgs.map((link) => {
      return db.query(
        format(
          "INSERT INTO img (link, owner) VALUES (%L, %L)",
          link,
          resort.name
        )
      );
    });
    await Promise.all(promises);
    res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: err.message });
  }
};

const updateResort = async (req, res) => {
  const { name: qName, values: resort } = req.body;
  if (!resort) return res.status(400).json({ message: "values not provided" });
  try {
    const setValues = Object.keys(resort)
      .map((key) => format("%I=%L", key, resort[key]))
      .join(", ");
    const { rows } = await db.query(
      format(
        `UPDATE resort SET ${setValues} WHERE name = %L RETURNING *`,
        qName
      )
    );
    res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: err.message });
  }
};

const getAllResorts = async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM resort");
    res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: err.message });
  }
};

module.exports = {
  getResortByCountry,
  getMultipleResortByBame,
  getResortByBame,
  deleteResortByBame,
  createResort,
  updateResort,
  getAllResorts,
};
