
const express = require("express");
const router = express.Router();

const jwtHelper = require("../config/jwthelper");
const getdbName = require("../config/dbName");
const controllerGetProjects = require("../controller/project-management/get-projects.controller");
const controllerUpdateProjects = require("../controller/project-management/update-projects.controller")

router.get(
  "/getAllProjects",
  jwtHelper.verifyJwtToken,
  controllerGetProjects.getAllProjects
);

router.post(
  "/changeActiveStatusByID",
  jwtHelper.verifyJwtToken,
  getdbName.getDBNameByProjectID,
  controllerUpdateProjects.changeActiveStatusByID
)

router.post(
  "/addProjectToOrganization",
  jwtHelper.verifyJwtToken,
  getdbName.getDBNameByProjectID,
  controllerUpdateProjects.addProjectToOrganization 
)


module.exports = router;