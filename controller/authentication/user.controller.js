
const bcrypt = require("bcryptjs");
const passport = require("passport");
var waterfall = require("async-waterfall");
const url = require("url");
var hostName = process.env.host_name;


var ObjectID = require("mongodb").ObjectID;
var domainPolicy = process.env.domainPolicy;
var hostProtocol = process.env.host_protocol;


var userModel = require("../../model/authentication/user.model");
const User = require("../../model/authentication/user.model");

module.exports.authenticate = (req, res, next) => {
  waterfall(
    [
      function (callback) {
        passport.authenticate("local", (err, user, msg) => {
          //If authentication fails
          if (err) return res.status(400).json(err);
          //If Authentication succeeds
          else if (user) {
            var token = User.generateJwt(user);
            callback(null, token, user);
          }
          //unknown user
          else {
            if (msg == "OAUTH Registered") {
              return res.status(409).json(msg);
            } else {
              return res.status(200).json({
                status: false,
                msg: msg.message
              });
            }
          }
        })(req, res);
      }
    ],

    function (err, token, user) {
      userModel.lastLoginDate(user._id, function (err, result) {
        if (err) throw err;
        return res.status(200).json({
          status: true,
          token: token,
          loginCount: 30
        });
      });
    }
  );
};