const updateUserModel = require("../../model/user-management/update-user-details.models");
const dbURL = process.env.database_url;
const { ObjectId } = require("mongodb");

module.exports.addAccessToProjectsByOrganization = async (req, res, next) => {
  try {
    let dbName = "ktern-masterdb";
    const { userid, orgIds } = req.body;
    let user = await updateUserModel.getUserByID(dbName, dbURL, userid);
    let response = [];

    if (user) {
      // Formulate the User Structure
      let projectUser = user.map((currentUser) => ({
        _id: currentUser._id,
        email: currentUser.email,
        userID: currentUser.userID,
        fullName: currentUser.fullName,
        mobileNo: currentUser.mobileNo,
        active: currentUser.active,
        aboutMe: currentUser.aboutMe,
        location: currentUser.location,
        registeredOn: new Date(currentUser.registeredOn) ? new Date(currentUser.registeredOn) : "",
        role: ObjectId.isValid(currentUser.role) ? new ObjectId(currentUser.role) : "",

        inviteStatus: currentUser.inviteStatus,
        invitedBy: ObjectId.isValid(currentUser.invitedBy)
          ? new ObjectId(currentUser.invitedBy)
          : "",

        lastLogin: currentUser.lastLogin,
        reportingTo: ObjectId.isValid(currentUser.reportingTo)
          ? new ObjectId(currentUser.reportingTo)
          : "",
        dailyUpdate: currentUser.dailyUpdate,
        eventNotification: currentUser.eventNotification,
        threadComments: currentUser.threadComments,
        workItemAssigned: currentUser.workItemAssigned,
        workItemStatusUpdates: currentUser.workItemStatusUpdates,
        team: ObjectId.isValid(currentUser.team) ? new ObjectId(currentUser.team) : "",
        accessLevel: ObjectId.isValid(currentUser.accessLevel)
          ? new ObjectId(currentUser.accessLevel)
          : "",
        orgID: ObjectId.isValid(currentUser.accessLevel)
          ? new ObjectId(currentUser.accessLevel)
          : "",
        orgDomain: currentUser.orgDomain,
        verificationToken: currentUser.verificationToken,
        organizationType: ObjectId.isValid(currentUser.organizationType)
          ? new ObjectId(currentUser.organizationType)
          : "",
      }));

      for (const orgId of orgIds) {
        let organization = await updateUserModel.getOrganizationByID(dbName, dbURL, orgId);

        if (organization && organization.projects && organization.projects.length > 0) {
          for (const projectId of organization.projects) {
            let project = await updateUserModel.getProjectByProjectID(dbName, dbURL, projectId);

            if (project) {
              const dbName = project.dbName;
              let finalData = project.projectMembers.map((obj) => obj.toString());

              if (!finalData.includes(userid)) {
                // If user not present add the user into Project Members
                await updateUserModel.addUserAsProjectMemebersByProject(
                  dbName,
                  dbURL,
                  projectId,
                  userid
                );

                // Check if the current user is already existing in the project Database users
                let existingUser = await updateUserModel.getUserByProject(dbName, dbURL, userid);

                // If not present add the user into the user collection of the project
                if (!existingUser) {
                  await updateUserModel.addUserToProject(dbName, dbURL, projectUser);

                  response.push(
                    `Adding user to the Project ${projectUser[0].fullName} - ${dbName}`
                  );
                  console.log(`Adding user to the Project ${projectUser[0].fullName} - ${dbName}`);
                } else {
                  console.log("User Already Present In the Project Database");
                  response.push(`User Already Present In the Project Database ${dbName}`);
                }
              } else {
                console.log(`User is Already a member of the project ${dbName}`);
                response.push(`User is Already a member of the project ${dbName}`);
              }
            } else {
              console.log("Project Not Found");
              response.push(`Project Not Found ${dbName}`);
            }
          }
        } else {
          console.log("Organization Not Found");
          res.status(404).json({
            status: false,
            message: "Organization Not Found",
          });
          response.push(`Organization Not Found ${dbName}`);
        }
      }

      return res.status(200).json({
        status: true,
        message: "User Added Successfully",
      });
    } else {
      res.status(404).json({
        status: false,
        message: "User Not Found",
      });
    }
  } catch (err) {
    console.log(err);
  }

  //
};
