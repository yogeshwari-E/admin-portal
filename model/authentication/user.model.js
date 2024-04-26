
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var MongoClient = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;

var url = process.env.database_url;

const dbconnection = require("../db");

module.exports.encryptPassword = function (password, callback) {
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, function (err, hash) {
      if (err) throw err;
      callback(null, hash, salt);
    });
  });
};

module.exports.saveUser = function (user, callback) {
  dbconnection.DBConnection(url, function (err, db) {
    if (err) throw err;
    //From Customer Database
    var dbo = db.db("ktern-masterdb");
    dbo.collection("kt_m_users").insertOne(user, function (err, result) {
      // db.close();
      callback(null, result);
    });
  });
};

module.exports.loginCountUpdate = function (userid, callback) {
  dbconnection.DBConnection(url, function (err, db) {
    if (err) throw err;
    //From Customer Database
    var dbo = db.db("ktern-masterdb");
    dbo
      .collection("kt_m_users")
      .findOneAndUpdate(
        { _id: ObjectID(userid) },
        { $inc: { loginCount: 1 } },
        function (err, result) {
          // db.close();
          callback(null, result);
        }
      );
  });
};

module.exports.updateUserInfo = function (userid, firebaseid, callback) {
  dbconnection.DBConnection(url, function (err, db) {
    if (err) throw err;
    //From Customer Database
    var dbo = db.db("ktern-masterdb");
    dbo
      .collection("kt_m_users")
      .findOneAndUpdate(
        { _id: ObjectID(userid) },
        { $set: { firebaseid: firebaseid } },
        { returnOriginal: false },
        function (err, result) {
          // db.close();
          callback(null, result.value);
        }
      );
  });
};

module.exports.readUserProfile = (id, callback) => {
  dbconnection.DBConnection(url, (err, db) => {
    var dbo = db.db("ktern-masterdb");
    dbo
      .collection("kt_m_users")
      .aggregate([
        {
          $match: {
            _id: ObjectID(id)
          }
        },
        {
          $project: {
            _id: 1,
            fullName: 1,
            userID: 1,
            email: 1,
            socketID: 1,
            recorderID: 1,
            angularID: 1,
            registerdOn: 1,
            mobileNo: 1,
            aboutMe: 1,
            location: 1,
            inviteStatus: 1,
            organization: 1,
            organizationType: 1,
            workItemAssigned: 1,
            threadComments: 1,
            workItemStatusUpdates: 1,
            eventNotification: 1,
            avatar: 1,
            connectorStatus: 1,
            authSource: 1,
            eula: 1
          }
        }
      ])
      .toArray(function (err, users) {
        // db.close();
        callback(null, users[0]);
      });
  });
};

// //Methods
module.exports.verifyPassword = function (password, db_password) {
  return bcrypt.compareSync(password, db_password);
};

module.exports.generateJwt = function (user) {
  return jwt.sign(
    {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      orgID: user.orgID
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXP
    }
  );
};

module.exports.getUserById = function (id, callback) {
  dbconnection.DBConnection(url, (err, db) => {
    var dbo = db.db("ktern-masterdb");
    dbo
      .collection("kt_m_users")
      .aggregate([
        {
          $match: {
            _id: ObjectID(id)
          }
        },
        {
          $lookup: {
            from: "kt_m_users",
            localField: "reportingTo",
            foreignField: "_id",
            as: "users"
          }
        },
        {
          $unwind: { path: "$users", preserveNullAndEmptyArrays: true }
        },
        {
          $lookup: {
            from: "kt_m_roles",
            localField: "role",
            foreignField: "_id",
            as: "roles"
          }
        },
        {
          $unwind: { path: "$roles", preserveNullAndEmptyArrays: true }
        },
        {
          $project: {
            fullName: 1,
            email: 1,
            role: "$roles.roleName",
            registerdOn: 1,
            reportingTo: "$users.fullName",
            mobileNo: 1,
            aboutMe: 1,
            location: 1,
            inviteStatus: 1,
            organization: 1,
            workItemAssigned: 1,
            workItemStatusUpdates: 1,
            workItemAttention: 1,
            threadComments: 1,
            eventNotification: 1,
            dailyUpdates: 1,
            avatar: 1
          }
        }
      ])
      .toArray(function (err, users) {
        // db.close();
        callback(null, users[0]);
      });
  });
};

module.exports.getUserByEmail = function (email, callback) {
  dbconnection.DBConnection(url, (err, db) => {
    var dbo = db.db("ktern-masterdb");
    dbo
      .collection("kt_m_users")
      .aggregate([
        {
          $match: {
            email: email
          }
        },
        {
          $lookup: {
            from: "kt_m_users",
            localField: "reportingTo",
            foreignField: "_id",
            as: "users"
          }
        },
        {
          $unwind: { path: "$users", preserveNullAndEmptyArrays: true }
        },
        {
          $lookup: {
            from: "kt_m_roles",
            localField: "role",
            foreignField: "_id",
            as: "roles"
          }
        },
        {
          $unwind: { path: "$roles", preserveNullAndEmptyArrays: true }
        },
        {
          $project: {
            _id: 1,
            fullName: 1,
            email: 1,
            role: "$roles.roleName",
            registerdOn: 1,
            reportingTo: "$users.fullName",
            mobileNo: 1,
            aboutMe: 1,
            location: 1,
            inviteStatus: 1,
            organization: 1,
            orgID: 1,
            workItemAssigned: 1,
            workItemStatusUpdates: 1,
            workItemAttention: 1,
            threadComments: 1,
            eventNotification: 1,
            dailyUpdates: 1,
            avatar: 1
          }
        }
      ])
      .toArray(function (err, users) {
        // db.close();
        callback(null, users);
      });
  });
};

module.exports.getAllUsers = function (dbName, dbURL, id, callback) {
  dbconnection.DBConnection(dbURL, (err, db) => {
    var dbo = db.db(dbName);
    dbo
      .collection("kt_m_users")
      .aggregate([
        { $match: { active: true } },
        {
          $lookup: {
            from: "kt_m_users",
            localField: "reportingTo",
            foreignField: "_id",
            as: "users"
          }
        },
        {
          $unwind: { path: "$users", preserveNullAndEmptyArrays: true }
        },
        {
          $project: {
            fullName: 1,
            email: 1,
            role: 1,
            registerdOn: 1,
            reportingTo: "$users.fullName",
            mobileNo: 1,
            aboutMe: 1,
            location: 1,
            inviteStatus: 1,
            organization: 1,
            workItemAssigned: 1,
            workItemStatusUpdates: 1,
            workItemAttention: 1,
            threadComments: 1,
            eventNotification: 1,
            dailyUpdates: 1,
            avatar: 1
          }
        }
      ])
      .toArray(function (err, users) {
        // db.close();
        callback(null, users);
      });
  });
};

module.exports.insertHashKey = function (userid, hashkey, callback) {
  dbconnection.DBConnection(url, function (err, db) {
    if (err) throw err;
    //From Customer Database
    var dbo = db.db("ktern-masterdb");

    dbo
      .collection("kt_m_users")
      .findOneAndUpdate(
        { _id: ObjectID(userid) },
        { $set: { ip_address: hashkey } },
        function (err, user) {
          if (err) throw err;
          else {
            callback(null, user);
          }
        }
      );
  });
};

module.exports.lastLoginDate = function (userid, callback) {
  dbconnection.DBConnection(url, function (err, db) {
    if (err) throw err;
    //From Customer Database
    var dbo = db.db("ktern-masterdb");

    dbo
      .collection("kt_m_users")
      .findOneAndUpdate(
        { _id: ObjectID(userid) },
        { $set: { lastLogin: new Date(), authSource: "ktern" } },
        function (err, user) {
          if (err) throw err;
          else {
            callback(null, user);
          }
        }
      );
  });
};

module.exports.loginOAuthUpdate = function (userid, data, callback) {
  dbconnection.DBConnection(url, function (err, db) {
    if (err) throw err;
    //From Customer Database
    var dbo = db.db("ktern-masterdb");

    dbo
      .collection("kt_m_users")
      .findOneAndUpdate({ _id: ObjectID(userid) }, { $set: data }, function (err, user) {
        if (err) throw err;
        else {
          callback(null, user);
        }
      });
  });
};

module.exports.getLatestUserID = (callback) => {
  dbconnection.DBConnection(url, (err, db) => {
    if (err) throw err;
    var dbo = db.db("ktern-masterdb");
    dbo
      .collection("kt_m_users")
      .find({})
      .sort({ userID: -1 })
      .collation({ locale: "en_US", numericOrdering: true })
      .limit(1)
      .toArray(function (err, users) {
        // db.close();
        callback(null, users[0]);
      });
  });
};

module.exports.updateValidationToken = (email, domain, callback) => {
  var generatedObjectID = new ObjectID().toHexString();

  dbconnection.DBConnection(url, (err, db) => {
    if (err) throw err;
    var dbo = db.db("ktern-masterdb");
    dbo.collection("kt_m_users").findOneAndUpdate(
      {
        $and: [{ orgDomain: domain }, { email: email }, { inviteStatus: "Accepted" }]
      },
      {
        $set: {
          passwordRequestTime: new Date(),
          validationToken: generatedObjectID
        }
      },
      function (err, result) {
        // db.close();
        callback(null, result, generatedObjectID);
      }
    );
  });
};


