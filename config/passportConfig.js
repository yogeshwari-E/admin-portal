const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
var MongoClient = require("mongodb").MongoClient;
var domainPolicy = process.env.domainPolicy;
var User = require("../model/authentication/user.model");
let dbConnection = require("../model/db");

var url = process.env.database_url;

// "database_url": "mongodb+srv://frainlar:Edson@cluster0-kguhl.gcp.mongodb.net/test?retryWrites=true&w=majority",
//     "file_db": "mongodb+srv://frainlar:Edson@cluster0-kguhl.gcp.mongodb.net",

passport.use(
  new localStrategy(
    {
      usernameField: "email",
      passReqToCallback: true
    },
    (req, username, password, done) => {
      if (domainPolicy == "Localhost") var domain = "quality";
      else var domain = req.headers.host.split(".")[0];

      console.log(url, "url here") 
      dbConnection.DBConnection(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("ktern-masterdb");
        username = username.toLowerCase();
        dbo.collection("kt_m_users").findOne(
          {
            $and: [
              { email: username },
              { orgDomain: domain },
              { inviteStatus: "Accepted" },
              { active: true }
            ]
          },
          (err, userDetails) => {
            console.log(userDetails, "user details")
            // db.close();
            if (err) return done(err);
            else if (!userDetails)
              return done(null, false, {
                message:
                  "Couldn't find your KTern Account. Login with a different account or signup with a new one"
              });
            else if (!userDetails.password)
              return done(null, false, { message: "OAUTH Registered" });
            else if (!User.verifyPassword(password, userDetails.password))
              return done(null, false, {
                message: "Your email and/or password do not match"
              });
            else return done(null, userDetails);
          }
        );
      });
    }
  )
);
