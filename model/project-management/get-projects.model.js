const _ = require("underscore");
const ObjectID = require("mongodb").ObjectID;

const dbconnection = require("../db");
var url = process.env.database_url;

module.exports.getAllProjectsUnderOrganization = function (callback) {
  dbconnection.DBConnection(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("ktern-masterdb");
    dbo
        .collection("kt_m_organizations")
        .aggregate([
            { $match: { active: true } },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    projects: 1
                }
            },
            {
                $lookup: {
                    from: "kt_m_projects",
                    localField: "projects",
                    foreignField: "_id",
                    as: "projectDetails"
                }
            }
        ])
        .toArray(function (err, parameters) {
            if (err) {
                callback(err);
                return;
            }

            const orgsWithProjects = {};
            // Iterate over each organization document
            parameters.forEach((org) => {
                const orgName = org.name;
                // Iterate over projects array within the organization document
                org.projectDetails.forEach(project => {                    // Get the project name from the projectDetails array
                    const projectName = project.projectName;
                    // Add the project name to the organization
                    if (!orgsWithProjects[orgName]) {
                        orgsWithProjects[orgName] = [];
                    }
                    orgsWithProjects[orgName].push(projectName);
                });
            });
            dbo.collection("kt_m_projects").find({ organizations: { $exists: false } }).toArray(function (err, unknownProjects) {
              if (err) {
                  callback(err);
                  return;
              }
              // Add project names for unknown organizations
              unknownProjects.forEach(project => {
                  const projectName = project.projectName;
                  if (!orgsWithProjects["Unknown Organization"]) {
                      orgsWithProjects["Unknown Organization"] = [];
                  }
                  orgsWithProjects["Unknown Organization"].push(projectName);
              });
            callback(null, orgsWithProjects);
      });
    });
  });
}