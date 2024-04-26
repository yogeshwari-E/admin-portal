const updateUserModel = require("../../model/user-management/update-user-details.models");
module.exports.getAccessToProjects = async function(req, res, next){

  const dbName = req.dbName;
  const userid = req.body.userid;
  const orgid = req.body.orgid;

  updateUserModel.processOrgs(userid, orgid, function(err, msg){
    if (err) throw err;
    
      if(msg.status){
        res.status(200).json({
          status: true
      })
    }
  })
    // console.log("Operation done")
    
    // 

  
}