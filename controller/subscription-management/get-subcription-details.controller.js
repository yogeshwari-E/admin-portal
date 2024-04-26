const getSubscriptionModel = require("../../model/subscription-management/get-subscription-details.model");

module.exports.getStreamSubscription = (req, res, next) => {
  console.log(req.dbName);
  var project = req.dbName;
  var dbURL = req.dbURL;  

  getSubscriptionModel.getStreamSubscriptionDetails( project, dbURL, function (err, subscriptionDetails){
    if (err) throw err;

    res.status(200).json({
      status: true,
      data: subscriptionDetails
    });
  });
}

module.exports.getStreamSubscriptionById = (req, res, next) => {
  var project = req.dbName;
  var dbURL = req.dbURL;  
  var streamId = req.params.streamId;

  getSubscriptionModel.getStreamSubscriptionDetailsById(project, dbURL, streamId, function (err, subscriptionDetails){
    if (err) throw err;
    res.status(200).json({
      status: true,
      data: subscriptionDetails
    });
  });
}