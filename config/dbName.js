const { ObjectId } = require("mongodb");
const { DBConnectionAsync } = require("../model/db");

var MongoClient = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;
var url = process.env.database_url;

module.exports.getDBNameByProjectID = async (req, res, next) => {
  let projectID = req.query.project;
 

  try {
    let client = await DBConnectionAsync(url);
    if (ObjectId.isValid(projectID)) {
      console.log("valid id");
        let result = await client
        .db("ktern-masterdb")
        .collection("kt_m_projects")
        .findOne({
          $and: [{ _id: ObjectId(projectID) }, { projectMembers: { $in: [ObjectId(req._id)] } }]
        });
      // console.log("result", result);
      if (result) {

        req.dbURL = result.dbURL;
        req.dbName = result.dbName;
        req.dbID = req.query.project;
        req.projectID = result.projectID;
        req.inid = result.inid || "";
        next();
      }
    } else {
      return res.status(401).json({
        status: false,
        msg: "Unauthorized to perform the action - Invalid user"
      });
    }
  } catch (err) {
    console.log("+++++++ ERROR +++++++++ " + err);
    return res.status(401).json({
      status: false,
      msg: "Unauthorized to perform the action - Invalid project"
    });
  }
};

module.exports.getDBNameByProjectIDWithoutAuth = async (req, res, next) => {
  let projectID = req.query.project;

  try {
    let client = await DBConnectionAsync(url);
    if (ObjectId.isValid(projectID)) {
      let result = await client
        .db("ktern-masterdb")
        .collection("kt_m_projects")
        .findOne({
          _id: ObjectID(projectID)
        });

      if (result) {
        req.dbURL = result.dbURL;
        req.dbName = result.dbName;
        req.dbID = req.query.project;
        req.projectID = result.projectID;
        req.inid = result.inid || "";
        next();
      }
    } else {
      return res.status(401).json({
        status: false,
        msg: "Unauthorized to perform the action - Invalid user"
      });
    }
  } catch (err) {
    console.log("+++++++ INVALID PROJECT ID +++++++++ " + projectID);
    return res.status(401).json({
      status: false,
      msg: "Unauthorized to perform the action - Invalid project"
    });
  }
};
