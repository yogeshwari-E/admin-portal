const updateProjectModel = require("../../model/project-management/update-projects.model");
const waterfall = require("async-waterfall");
const getProjectController = require("../project-management/get-projects.controller")
const getProjectModel = require("../../model/project-management/get-projects.model")


module.exports.changeActiveStatusByID = (req,res, next) =>{
  var project = req.dbName;
  var dbURL = req.dbURL;
  var query = req.body;
  var id = req.query.project;
  var status;
  waterfall([
    function ( callback ) {
      updateProjectModel.changeActiveStatusByID( id,query, function(err, result)
      { 
        if( query.active === true){
            status = "Activated"
        }
        else{
          status = "Deactivated"
        }
        
          if (err) throw err;
          return res.status(200).json({
            status: true,
            msg: `Project Successfully ${status}`
          });
        });
      }
    ]);
  }

module.exports.addProjectToOrganization = (req, res, next) => {
  var project = req.body.project;
  var organization = req.body.organization;
  updateProjectModel.addProjectToOrganization( project, organization, function (err, result) { 
    if (err) throw err;
    if (result.status) {
      return res.status(200).json({
        status: true,
        msg: `Project Added to ${organization}`
        })
      }
    else{
      return res.status(400).json({
        status: true,
        msg: `Something Bad Happened`
        })
      }
    })
  }


  
    