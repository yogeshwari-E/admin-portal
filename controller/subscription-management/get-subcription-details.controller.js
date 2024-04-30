const getSubscriptionModel = require("../../model/subscription-management/get-subscription-details.model");

module.exports.getStreamSubscription = async (req, res, next) => {

  var project = req.dbName;
  var dbURL = req.dbURL;  
try
 { var subscriptionDetails = await getSubscriptionModel.getStreamSubscriptionDetails( project, dbURL);
    res.status(200).json({
      status: true,
      data: subscriptionDetails
    });
  }
  catch (err){
    console.log(err);
  }
}

module.exports.getStreamSubscriptionById = async (req, res, next) => {
  var project = req.dbName;
  var dbURL = req.dbURL;  
  var streamId = req.params.streamId;
try
 { subscriptionDetails = getSubscriptionModel.getStreamSubscriptionDetailsById(project, dbURL, streamId)
    res.status(200).json({
      status: true,
      data: subscriptionDetails
    });
  }
catch(err){
  console.log(err);
  res.status(400).json({
    status: false,
    data: `Somthing Went Wrong`,
  });
  }
}

