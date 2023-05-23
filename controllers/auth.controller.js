const db = require("../connection/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  signupUser: (req, res, next) => {
    try {
      let user = {
        fullname: req.body.fullname,
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hash(req.body.password, 8),
        phone_number: req.body.phone_number,
      };

      bcrypt
        .hash(req.body.password, 8)
        .then((hash) => {
          user.password = hash;
        })
        .then(() => {
          let sql = "INSERT INTO users SET ?";
          db.query(sql, user, (err, result) => {
            if (err) {
              res.send({ message: "Error creating the user" });
            }
          });

          db.query(
            "SELECT * from users WHERE email=?",
            user.email,
            (err, response) => {
              if (err) {
                res.send({ message: err });
              }
              return res.status(201).send({
                userdata: response,
                message: "successfully registered!",
              });
            }
          );
        });
    } catch (error) {
      next(error);
    }
  },

  loginUser: (req, res, next) => {
    try {
      const { email, password } = req.body;
      db.query("SELECT * FROM users WHERE email =?", email, (err, result) => {
        if (err) {
          return res.status(400).send({ status: 401, mesaage: err });
        }

        if (result.length === 0) {
          return res.status(401).send({
            status: 401,
            message: "Email or password is invalid",
          });
        }

        bcrypt.compare(password, result[0].password).then((isMatch) => {
          if (isMatch === false) {
            return res.status(401).send({
              status: 401,
              message: "email or Password is incorrect ",
            });
          }
          //   generate token
          const token = jwt.sign(
            { id: result[0].user_id.toString() },
            process.env.SECRET_KEY
          );
          return res.status(200).send({
            message: "Logged in successfully",
            user: result[0],
            token,
          });
        });
      });
    } catch (error) {
      next(error);
    }
  },

  forgetPassword: (req, res, next) => {
    try {
      let email = req.body.email;
      let password = bcrypt.hash(req.body.password, 8);

      let checkMailSql = `SELECT * FROM users WHERE email = ?`;

      db.query(checkMailSql, email, (err, result) => {
        if (err) {
          return res
            .status(400)
            .send({ status: false, message: "No email found!" });
        }
      });

      let changePasswordSql = `UPDATE users SET password = ? where email = ?`;
      bcrypt
        .hash(req.body.password, 8)
        .then((hash) => {
          password = hash;
        })
        .then(() => {
          db.query(
            `UPDATE users SET password = ? where email = ?`,
            [password, email],

            (err, result) => {
              if (err) {
                return res.status(200).send({
                  status: false,
                  message: "Error changing the password",
                });
              }

              res.status(201).send({
                message: true,
                message: "Successfully chnaged password",
              });
            }
          );
        });
    } catch (error) {
      next(error);
    }
  },
};
