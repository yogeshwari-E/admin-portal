
const dbURL = process.env.database_url;
const { ObjectId } = require("mongodb").ObjectId;

module.exports.getAllProjectsUnderOrganization = async () => {
  try {
    let client = await dbconnection.DBConnectionAsync(dbURL);
    let dbo = await client
      .db("ktern-masterdb")
      .collection("kt_m_organizations")
      .aggregate([
        { $match: { active: true } },
        {
          $project: {
            _id: 0,
            name: 1,
            projects: 1,
          },
        },
        {
          $lookup: {
            from: "kt_m_projects",
            localField: "projects",
            foreignField: "_id",
            as: "projectDetails",
          },
        },
      ])
      .toArray();
    return dbo;
  } catch (err) {
    console.log(err);
  }
};

module.exports.getAllProjectsWithoutOrganization = async () => {
  try {
    let client = await dbconnection.DBConnectionAsync(dbURL);
    dbo = await client
      .db("ktern-masterdb")
      .collection("kt_m_projects")
      .find({ organizations: { $exists: false } })
      .toArray();
    return dbo;
  } catch (err) {
    console.log(err);
  }
};

module.exports.addOrganizationField = async ( project, organization) => {
  try{
    
  }
  catch{
    console.log(err);
    return err;
  }
}
