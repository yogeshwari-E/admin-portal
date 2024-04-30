const getUserModel = require("../../model/user-management/get-user-details.model");
const dbURL = process.env.database_url;

module.exports.getUserAtOrganization = async (req, res, next) => {
  try{
  var result = await getUserModel.getUserAtOrganization(dbURL)

  const Organizations = {};
  result.forEach(user => {
      const domain = user.domain;
      const projectMember = user.fullName;
      if (!Organizations[domain]) {
          Organizations[domain] = [];
      }
      Organizations[domain].push(projectMember);
  });
  res.status(200).json({
    status: true,
    data: Organizations
  });
}
catch(err){
  console.log(err);
    res.status(500).json({
      status: false,
      error: "An error occurred while fetching user data"
    });
  }
}
