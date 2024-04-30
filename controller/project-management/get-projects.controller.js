const getProjectsModel = require("../../model/project-management/get-projects.model");

module.exports.getAllProjects = async (req, res, next) => {
  try
  {let projectsWithOrganization = await getProjectsModel.getAllProjectsUnderOrganization();
  let projectsWithOutOrganization = await getProjectsModel.getAllProjectsWithoutOrganization();
  const Projects = {};

  projectsWithOrganization.forEach((org) => {
    const orgName = org.name;
    org.projectDetails.forEach((project) => {
      const projectName = project.projectName;
      if (!Projects[orgName]) {
        Projects[orgName] = [];
      }
      Projects[orgName].push(projectName);
    });
  });

  projectsWithOutOrganization.forEach((project) => {
    const projectName = project.projectName;
    if (!Projects["Organization Unknown"]) {
      Projects["Organization Unknown"] = [];
    }
    Projects["Organization Unknown"].push(projectName);
  }); 

  res.status(200).json({
    status: true,
    data: Projects,
  });
}
catch(err){
  res.status(400).json({
    status: false,
    data: `Somthing Went Wrong`,
  });
}
};

