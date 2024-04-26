const express = require("express");
const router = express.Router();

const jwtHelper = require("../config/jwthelper");
const getdbName = require("../config/dbName");

const controllerGetStreamSubscription = require("../controller/subscription-management/get-subcription-details.controller");
const controllerUpdateStreamSubscrition = require("../controller/subscription-management/update-subscription-details.controller");

router.get(
  "/getStreamSubscription",
  jwtHelper.verifyJwtToken,
  getdbName.getDBNameByProjectID,
  controllerGetStreamSubscription.getStreamSubscription
);

router.get(
  "/getStreamSubscriptionById/:streamId",
  jwtHelper.verifyJwtToken,
  getdbName.getDBNameByProjectID,
  controllerGetStreamSubscription.getStreamSubscriptionById
);

router.post(
  "/updateStreamSubscriptionStatus/:streamId",
  jwtHelper.verifyJwtToken,
  getdbName.getDBNameByProjectID,
  controllerUpdateStreamSubscrition.updateStreamSubscription
);

module.exports = router;