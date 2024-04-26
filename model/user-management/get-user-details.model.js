const _ = require("underscore");

const dbconnection = require("../db");
const { ReplSet } = require("mongodb/lib/core");
const { collections } = require("mongodb/lib/operations/db_ops");
var ObjectID = require("mongodb").ObjectID;
var url = process.env.database_url;

module.exports.getUserAtOrganization = function( callback) {
  dbconnection.DBConnection(url, function(err, db){

  var dbo=  db.db("ktern-masterdb");
  dbo
  .collection("kt_m_users")
  .aggregate([
    {
      $match: {
        email: { $exists: true, $ne: "" }
      }
    },
    {
      $addFields: {
        domain: {
          $arrayElemAt: [{ $split: ["$email", "@"] }, 1]
        }
      }
    },
    {
      $project: {
        domain: 1,
        fullName: { $trim: { input: "$fullName" } } // Remove leading/trailing spaces
      }
    },
    {
      $match: {
        fullName: { $ne: "" } // Remove documents where fullName is an empty string
      }
    }
    
  ]).toArray(function (err, result) {
    if (err) {
        callback(err);
        return;
    }
    const projects = {};
    console.log(result)
    result.forEach(user => {
        const domain = user.domain;
        const projectMember = user.fullName;
        
        if (!projects[domain]) {
            projects[domain] = [];
        }
        
        projects[domain].push(projectMember);
    });
    callback(null, projects);
    })
  });
}

  


