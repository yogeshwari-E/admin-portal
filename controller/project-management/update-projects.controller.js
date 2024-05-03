const updateProjectModel = require("../../model/project-management/update-projects.model");
const waterfall = require("async-waterfall");
const updateUserModel = require("../../model/user-management/update-user-details.models")
const getProjectController = require("../project-management/get-projects.controller")
const getProjectModel = require("../../model/project-management/get-projects.model");
const { result } = require("underscore");

const dbURL = process.env.database_url;
module.exports.changeActiveStatusByID = async (req,res, next) =>{

  var query = req.body;
  var id = req.query.project;
  var status;

  await updateProjectModel.changeActiveStatusByID( id, query, dbURL); 
    if( query.active === true){
        status = "Activated"
    }
    else{
      status = "Deactivated"
    }
    return res.status(200).json({
      status: true,
      msg: `Project Successfully ${status}`
    });
  
}

module.exports.addProjectToOrganization = async (req, res, next) => {
 try{ 
  var projects = req.body.projects;
  var organization = req.body.organization;
  var organizationDetails = await updateUserModel.getOrganizationByID("ktern-masterdb", dbURL, organization);
  let org_name = organizationDetails.name;

  let promises = projects.map(async (project) => {
    return await updateProjectModel.addProjectToOrganization(project, organization, org_name);
  });

  let results = await Promise.all(promises);
  console.log(results)

  if (results) {
    return res.status(200).json({
      status: true,
      msg: `All projects added to organization successfully`
    });
  } else {
    return res.status(400).json({
      status: true,
      msg: `Failed to add projects to organization`
    });
  }
}
catch (err){
  res.status(400).json({
    status: false,
    data: `Somthing Went Wrong`,
  });
  console.log(err)
}
}
  


  
    