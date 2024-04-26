const waterfall = require("async-waterfall");

const dbconnection = require("../db");
var ObjectID = require("mongodb").ObjectID;


var url = process.env.database_url;

module.exports.changeActiveStatusByID = function (id, query, callback){
  dbconnection.DBConnection(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("ktern-masterdb");
    dbo
      .collection("kt_m_projects")
      .findOneAndUpdate( 
        { _id: ObjectID(id) },
        { $set : query },
        { returnOriginal: false },
        function (err, result) {
          if (err) throw err;
          callback(null, result);
        });
      });
    }



module.exports.addProjectToOrganization = function ( project, organization, callback){
  dbconnection.DBConnection(url, function (err, db) {
    if (err) throw err;

    var dbo = db.db("ktern-masterdb");
    dbo.collection("kt_m_organizations").updateOne(
      { _id: ObjectID(organization) },
      { $addToSet: { projects: ObjectID(project) } },
      function(err, res) {
        if (err) throw err;
        var msg = {
          status:true
        }
        return callback(null, msg);
    });
  })
}
    