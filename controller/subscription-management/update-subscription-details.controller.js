const updateSubscriptionModel = require("../../model/subscription-management/update-subscription-details.model");

module.exports.updateStreamSubscription = async (req, res, next) => {
  var dbName = req.dbName;
  var dbURL = req.dbURL;
  var streamId = req.params.streamId;
  var query =  req.body;
try
  { await updateSubscriptionModel.updateSubscriptionDetails( dbName, dbURL, streamId, query)
    // console.log(result)
    res.status(200).json({
      status: true,
      data: "Subscription Details Updated Successfully"
    });
  }
  catch (err){
    console.log(err);
    res.status(500).json({
      status: false,
      error: "An error occurred while updating subscription details"
    });
  }
}               