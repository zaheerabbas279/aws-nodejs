const jwt = require("jsonwebtoken");
const db = require("../connection/db");

const auth = async (req, res, next) => {
  try {
    const idToken = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(idToken, process.env.SECRET_KEY);
    req.id = decoded.id;
    sql = "SELECT * from users where user_id= ?";
    db.query(sql, decoded.id, (err, result) => {
      if (err) {
        return res.status(400).send({
          msg: "Errorr authenticating",
        });
      }

      return next();
    });
  } catch (e) {
    res.status(401).send({ error: "please authenticate." });
  }
};

module.exports = auth;
