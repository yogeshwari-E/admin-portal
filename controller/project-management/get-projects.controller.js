const getProjectsModel = require("../../model/project-management/get-projects.model");

module.exports.getAllProjects = (req, res, next) => {
  getProjectsModel.getAllProjectsUnderOrganization( function (err, projects){
    if (err) throw err;
    res.status(200).json({
      status: true,
      data: projects
    });
  });
}

