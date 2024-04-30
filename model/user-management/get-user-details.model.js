const _ = require("underscore");

const dbconnection = require("../db");
const { ReplSet } = require("mongodb/lib/core");
const { collections } = require("mongodb/lib/operations/db_ops");
var ObjectID = require("mongodb").ObjectID;
var url = process.env.database_url;


module.exports.getUserAtOrganization = async (dbURL) => {
  var client = await dbconnection.DBConnectionAsync(dbURL);
  var dbo = await client
    .db("ktern-masterdb")
    .collection("kt_m_users")
    .aggregate([
      {
        $match: {
          email: { $exists: true, $ne: "" },
        },
      },
      {
        $addFields: {
          domain: {
            $arrayElemAt: [{ $split: ["$email", "@"] }, 1],
          },
        },
      },
      {
        $project: {
          domain: 1,
          fullName: { $trim: { input: "$fullName" } }, // Remove leading/trailing spaces
        },
      },
      {
        $match: {
          fullName: { $ne: "" }, // Remove documents where fullName is an empty string
        },
      }
    ])
    .toArray();
  return dbo;
};
