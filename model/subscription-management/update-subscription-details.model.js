var dbconnection = require("../db");

var ObjectID = require("mongodb").ObjectID;

var url = process.env.database_url;

// module.exports.updateSubscriptionStatus = function (dbName, dbURL, id, query, callback){
//   dbconnection.DBConnection(dbURL, function(err, db){
//     if (err) throw err;
//     var dbo = db.db(dbName);
//     console.log("dbanme", dbName, id);
//     if ( query.active === true ){
//       var Newquery = { active : true , subscriptionStatus: "Live"};
//     }
//     else{
//       var Newquery = { active : false , subscriptionStatus: "Expired"};
//     }
//     dbo
//     .collection("kt_m_subscriptionDetails")
//     .findOneAndUpdate(
//       { _id: ObjectID(id) , type: "stream"},
//       { $set :  Newquery },
//       function(err, result)
//       {
//         if (err) throw err;
//         callback( err, result);
//       });
//   });
// }

// Function to update subscription details based on the provided fields
module.exports.updateSubscriptionDetails = function (dbName, dbURL, subscriptionId, updateFields, callback) {
  dbconnection.DBConnection(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);

    dbo.collection("kt_m_subscriptionDetails").updateOne(
      { _id: ObjectID(subscriptionId) }, 
      { $set: updateFields }, 
      function (err, result) {
        if (err) throw err;
        var msg ={
          status: true,
          submsg: "Subscription Details Updated Successfully"
        }
        callback(null, msg);
      }
    );
  });
};
