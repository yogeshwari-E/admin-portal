const getSubscriptionModel = require("../../model/subscription-management/update-subscription-details.model");

module.exports.updateStreamSubscription = (req, res, next) => {
  var dbName = req.dbName;
  var dbURL = req.dbURL;
  var streamId = req.params.streamId;
  var query =  req.body;
  getSubscriptionModel.updateSubscriptionDetails( dbName, dbURL, streamId, query, function (err, msg){
    if (err) throw err;

    res.status(200).json({
      status: true,
      data: msg
    });
  });
}

