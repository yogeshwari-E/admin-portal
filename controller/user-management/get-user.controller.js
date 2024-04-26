const getUserModel = require("../../model/user-management/get-user-details.model");

module.exports.getUserAtOrganization = (req,res,next) => {
  
  getUserModel.getUserAtOrganization( function(err, userDetails){
    if (err) throw err;
    res.status(200).json({
      status: true,
      data: userDetails
    });
  });
}