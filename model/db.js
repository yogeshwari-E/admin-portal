const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const _ = require("underscore");

var ObjectID = require("mongodb").ObjectID;
var MongoClient = require("mongodb").MongoClient;

var dbConnections = [];
var dbConnectionsSecondaryNode = [];

module.exports.DBConnection = (dbURL, done) => {
  var matchedConnection = _.filter(dbConnections, function (dt) {
    if (dt.dbURL) return dt.dbURL === dbURL;
  });

  if (matchedConnection.length > 0) {
    done(null, matchedConnection[0].connection);
  } else {
    MongoClient.connect(
      dbURL,
      {useNewUrlParser: true, useUnifiedTopology: true },
      function (err, db) {
        if (err) throw err;
        dbConnections.push({
          dbURL: dbURL,
          connection: db
        });

        done(null, db);
      }
    );
  }
};

module.exports.DBConnectionSecondaryNode = (dbURL, done) => {
  var matchedConnection = _.filter(dbConnectionsSecondaryNode, function (dt) {
    if (dt.dbURL) return dt.dbURL === dbURL;
  });

  if (matchedConnection.length > 0) {
    done(null, matchedConnection[0].connection);
  } else {
    MongoClient.connect(
      dbURL,
      { poolSize: 500,readPreference: "secondaryPreferred", useNewUrlParser: true, useUnifiedTopology: true },
      function (err, db) {
        if (err) throw err;

        dbConnectionsSecondaryNode.push({
          dbURL: dbURL,
          connection: db
        });

        done(null, db);
      }
    );
  }
};

module.exports.DBConnectionAsync = async (dbURL) => {
  let matchedConnection = _.filter(dbConnections, function (dt) {
    if (dt.dbURL) return dt.dbURL === dbURL;
  });

  if (matchedConnection.length > 0) {
    return matchedConnection[0].connection;
  } else {
    const db = await MongoClient.connect(dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      poolSize: 500
    });
    dbConnections.push({
      dbURL: dbURL,
      connection: db
    });
    return db;
  }
};


module.exports.DBConnectionAsyncSecondaryNode = async (dbURL) => {
  let matchedConnection = _.filter(dbConnectionsSecondaryNode, function (dt) {
    if (dt.dbURL) return dt.dbURL === dbURL;
  });

  if (matchedConnection.length > 0) {
    return matchedConnection[0].connection;
  } else {
    const db = await MongoClient.connect(dbURL, {
      readPreference: 'secondary', 
      useNewUrlParser: true,
      useUnifiedTopology: true,
      poolSize: 500
    });
    dbConnectionsSecondaryNode.push({
      dbURL: dbURL,
      connection: db
    });
    return db;
  }
};