const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
require("./connection/db");
const authRoutes = require("./routes/auth.routes");
const auth = require("./helpers/auth");


app.use(bodyParser.json());

app.use(cors())

app.use(
  cors({
    origin: "http://localhost:4200",
  })
);
app.get("/ping", (req, res, next) => {
  res.send({ message: "PONG!" });
});

app.get("/private", auth, (req, res, next) => {
  res.send({ message: "the private route" });
});


app.use(authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on the port ${process.env.PORT}`);
});
