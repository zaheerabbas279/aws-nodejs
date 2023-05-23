const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "blogdb",
});

db.connect((err) => {
  if (err) {
    console.log("Error connecting to the database!");
  } else {
    console.log("Connected to database successfully!");
  }
});

module.exports = db;
