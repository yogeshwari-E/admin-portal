const _ = require("underscore");

const dbconnection = require("../db");
var ObjectID = require("mongodb").ObjectID;
var url = process.env.database_url;

module.exports.getStreamSubscriptionDetails = function (dbName, dbURL, callback) {

  dbconnection.DBConnection(dbURL, function (err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    dbo
      .collection("kt_m_subscriptionDetails")
      .find({ active : true , subscriptionStatus: "Live" , type: "stream"})
      .toArray(function (err, subscriptionDetails) {
        if (err) {
          callback(err, null);
          return;
        }
        callback(null, subscriptionDetails);
      });
  });
};

module.exports.getStreamSubscriptionDetailsById = function (dbName, dbURL, callback) {

  dbconnection.DBConnection(dbURL, function (err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    dbo
      .collection("kt_m_subscriptionDetails")
      .find({ type: "stream" })
      .toArray(function (err, subscriptionDetails) {
        if (err) {
          callback(err, null);
          return;
        }
        callback(null, subscriptionDetails);
      });
  });
};