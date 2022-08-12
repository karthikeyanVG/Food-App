const express = require("express");
const users = express.Router();

const CustomerController = require('../controller/User.controller');


users.post("/register", CustomerController.register);

users.post("/login", CustomerController.login);

users.get("/getUser", CustomerController.get_user)

module.exports = users;
