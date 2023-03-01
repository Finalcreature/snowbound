const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const queryRouter = require("./routes/queryRouter");
const resortRouter = require("./routes/resortRouter");
const userRouter = require("./routes/userRouter");

const PORT = process.env.PORT || 8000;

app.use(cors());

app.use(express.json());

app.use("/", queryRouter);
app.use("/resort", resortRouter);
app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log("listening on port", PORT);
});
