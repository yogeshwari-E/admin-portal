const waterfall = require("async-waterfall");

const dbconnection = require("../db");
var ObjectID = require("mongodb").ObjectID;
const dbURL = process.env.database_url;

module.exports.changeActiveStatusByID = async (id, query, url) => {
  try 
  {
    let client = await dbconnection.DBConnectionAsync(url);
    var dbo = await client
    .db("ktern-masterdb")
    .collection("kt_m_projects")
    .updateOne( 
      { _id: new ObjectID(id) },
      { $set : query },
      { returnOriginal: false }
    );
    return dbo;
  }
  catch (err) {
    console.log(err)
  }
}



module.exports.addProjectToOrganization = async ( project, organization, org_name) => {
try{
    console.log("project", project);
  let client = await dbconnection.DBConnectionAsync(dbURL);

  var dbo = await client
  .db("ktern-masterdb")
  .collection("kt_m_organizations")
  .updateOne(
    { _id: ObjectID(organization) },
    { $addToSet: { projects: ObjectID(project) } }
  );
  dbo = await client
  .db("ktern-masterdb")
  .collection("kt_m_projects")
  .updateOne( 
      { _id: new ObjectID(project)},
      { $addToSet : {organizations : [org_name]} }
  )
  return dbo;
}
  catch (err){
    console.log(err)
  }
}

    