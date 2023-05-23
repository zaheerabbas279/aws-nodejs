const express = require("express");
const route = express.Router();
const authController = require("../controllers/auth.controller");

route.post("/signup", authController.signupUser);
route.post("/login", authController.loginUser);
route.put("/forgetpassword", authController.forgetPassword);

module.exports = route;
