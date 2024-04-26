const express = require("express");
const router = express.Router();

const jwtHelper = require("../config/jwthelper");
const getdbName = require("../config/dbName");

const getUserController = require("../controller/user-management/get-user.controller");
const updateUserController = require("../controller/user-management/update-user.controller");

router.get(
  "/getUserAtOrganizationLevel",
  jwtHelper.verifyJwtToken,
  getUserController.getUserAtOrganization
);

router.post(
  "/addAccessToProjectsByOrganization",
  jwtHelper.verifyJwtToken,
  // getdbName.getDBNameByProjectID,
  updateUserController.addAccessToProjectsByOrganization
);


// router.post(
//   "/addUserToOrgnization",
//   jwtHelper.verifyJwtToken,
//   getdbName.getDBNameByProjectID,
//   getUserController.addUserToOrganization
// );
module.exports = router;