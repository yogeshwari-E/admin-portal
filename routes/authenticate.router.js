const express = require("express");
const router = express.Router();
const passport = require("passport");
const controllerUser = require("../controller/authentication/user.controller");

router.post("/authenticate", 
controllerUser.authenticate);


module.exports = router;
