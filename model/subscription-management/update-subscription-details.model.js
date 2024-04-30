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
module.exports.updateSubscriptionDetails = async (dbName, dbURL, subscriptionId, updateFields) => {
  try{
    var client = await dbconnection.DBConnectionAsync(dbURL)
    dbo = await client 
    .db(dbName)
    .collection("kt_m_subscriptionDetails")
    .updateOne(
      { _id: new ObjectID(subscriptionId) }, 
      { $set: updateFields },
    );
  }
  catch (err){
    console.log(err);
  }
}