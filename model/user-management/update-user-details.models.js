
const uri = process.env.database_url;

const dbconnection = require("../db")
const { MongoClient, ObjectId } = require("mongodb");
// module.exports.processOrgs = function (userId, orgIds) {
//   try {
//     dbconnection.DBConnection(uri, async function (err, client) {
//       // Get the User from the masterdb
//       let currentUser = await client
//         .db("ktern-masterdb")
//         .collection("kt_m_users")
//         .find({ _id: new ObjectId(userId) })
//         .toArray();

//       if (currentUser) {
//         // Formulate the User Structure
//         let projectUser = currentUser.map((currentUser) => ({
//           _id: currentUser._id,
//           email: currentUser.email,
//           userID: currentUser.userID,
//           fullName: currentUser.fullName,
//           mobileNo: currentUser.mobileNo,
//           active: currentUser.active,
//           aboutMe: currentUser.aboutMe,
//           location: currentUser.location,
//           registeredOn: new Date(currentUser.registeredOn) ? new Date(currentUser.registeredOn) : "",
//           role: ObjectId.isValid(currentUser.role) ? new ObjectId(currentUser.role) : "",

//           inviteStatus: currentUser.inviteStatus,
//           invitedBy: ObjectId.isValid(currentUser.invitedBy)
//             ? new ObjectId(currentUser.invitedBy)
//             : "",

//           lastLogin: currentUser.lastLogin,
//           reportingTo: ObjectId.isValid(currentUser.reportingTo)
//             ? new ObjectId(currentUser.reportingTo)
//             : "",
//           dailyUpdate: currentUser.dailyUpdate,
//           eventNotification: currentUser.eventNotification,
//           threadComments: currentUser.threadComments,
//           workItemAssigned: currentUser.workItemAssigned,
//           workItemStatusUpdates: currentUser.workItemStatusUpdates,
//           team: ObjectId.isValid(currentUser.team) ? new ObjectId(currentUser.team) : "",
//           accessLevel: ObjectId.isValid(currentUser.accessLevel)
//             ? new ObjectId(currentUser.accessLevel)
//             : "",
//           orgID: ObjectId.isValid(currentUser.accessLevel)
//             ? new ObjectId(currentUser.accessLevel)
//             : "",
//           orgDomain: currentUser.orgDomain,
//           verificationToken: currentUser.verificationToken,
//           organizationType: ObjectId.isValid(currentUser.organizationType)
//             ? new ObjectId(currentUser.organizationType)
//             : "",
//         }));

//         // Looping the Organization
//         for (const orgId of orgIds) {
//           const organization = await client
//             .db("ktern-masterdb")
//             .collection("kt_m_organizations")
//             .findOne({ _id: new ObjectId(orgId) });

//           if (organization && organization.projects && organization.projects.length > 0) {
//             for (const projectId of organization.projects) {
//               let project = await client
//                 .db("ktern-masterdb")
//                 .collection("kt_m_projects")
//                 .findOne({ _id: new ObjectId(projectId) });

//               if (project) {
//                 const dbName = project.dbName;
//                 let finalData = project.projectMembers.map((obj) => obj.toString());

//                 if (!finalData.includes(userId)) {
//                   // If user not present add the user into Project Members
//                   await client
//                     .db("ktern-masterdb")
//                     .collection("kt_m_projects")
//                     .updateOne(
//                       { _id: new ObjectId(projectId) },
//                       { $addToSet: { projectMembers: new ObjectId(userId) } }
//                     );

//                   // Check if the current user is already existing in the project Database users

//                   let existingUser = await client
//                     .db(dbName)
//                     .collection("kt_m_users")
//                     .findOne({ _id: new ObjectId(userId) });

//                   // If not present add the user into the user collection of the project
//                   if (!existingUser) {
//                     await client.db(dbName).collection("kt_m_users").insertOne(projectUser[0]);

//                     console.log(`Adding user to the Project ${projectUser[0].fullName} - ${dbName}`);
//                   } else {
//                     console.log("User Already Present In the Project Databasr");
//                   }
//                 } else {
//                   console.log(`User is Already a member of the project ${dbName}`);
//                 }
//               } else {
//                 console.log("Project Not Found");
//               }
//             }
//           } else {
//             console.log("Organization Not Found");
//           }
//         }
//       }
//     })


//   } catch (err) {
//     console.log(err);
//   }
// }



module.exports.getUserByID = async (dbName, dbURL, userID) => {
  try {
    let client = await dbconnection.DBConnectionAsync(dbURL)
    let dbo = await client
      .db("ktern-masterdb")
      .collection("kt_m_users")
      .find({ _id: new ObjectId(userID) })
      .toArray();
    return dbo;
  } catch (err) {
    console.log(err)
  }
}


module.exports.getOrganizationByID = async (dbName, dbURL, orgID) => {
  try {
    let client = await dbconnection.DBConnectionAsync(dbURL)
    let dbo = await client
      .db(dbName)
      .collection("kt_m_organizations")
      .findOne({ _id: new ObjectId(orgID) });

    return dbo;
  } catch (err) {
    console.log(err)
  }
}


module.exports.getProjectByProjectID = async (dbName, dbURL, projectId) => {
  try {
    let client = await dbconnection.DBConnectionAsync(dbURL)
    let dbo = await client
      .db(dbName)
      .collection("kt_m_projects")
      .findOne({ _id: new ObjectId(projectId) });

    return dbo;

  } catch (err) {
    console.log(err)
  }
}


module.exports.addUserAsProjectMemebersByProject = async (dbName, dbURL, projectID, userID) => {
  try {
    let client = await dbconnection.DBConnectionAsync(dbURL)
    let dbo = await client
      .db(dbName)
      .collection("kt_m_projects")
      .updateOne(
        { _id: new ObjectId(projectID) },
        { $addToSet: { projectMembers: new ObjectId(userID) } }
      );
    return dbo;
  } catch (err) {
    console.log(err)
  }
}


module.exports.getUserByProject = async (dbName, dbURL, userId) => {
  try {
    let client = await dbconnection.DBConnectionAsync(dbURL)
    let dbo = await client
      .db(dbName)
      .collection("kt_m_users")
      .findOne({ _id: new ObjectId(userId) });
    return dbo;
  } catch (err) {
    console.log(err)
  }
}



module.exports.addUserToProject = async (dbName, dbURL, projectUser) => {
  try {
    let client = await dbconnection.DBConnectionAsync(dbURL)
    let dbo = await client.db(dbName).collection("kt_m_users").insertOne(projectUser);
    return dbo;
  } catch (err) {
    console.log(err)
  }
}



