require("./model/db");
require("./config/passportConfig");

const dbconnection = require("../admin-portal/model/db");

var url = process.env.database_url;
var port = process.env.PORT;


const compression = require('compression');
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const { ObjectId } = require('mongodb');


const rtsIndex = require("./routes/authenticate.router");
const rtsProjectManagement = require("./routes/project-management.router");
const rtsSubcriptionManagement = require("./routes/subcription-management.router");
const rtsUserManagement = require("./routes/user-management.router")

var app = express();
app.use(compression());

const server = require("http").Server(app);

app.use(bodyParser.json({ limit: "50mb", type: "application/json" }));
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cors());
// app.use(passport.initialize());
// app.use(passport.session());

app.use((req, res, next) => {
  next();
});



app.use("/api", rtsIndex);
app.use("/projectmanagement", rtsProjectManagement );
app.use("/subscriptionmanagement", rtsSubcriptionManagement );
app.use("/usermanagement", rtsUserManagement);
server.listen(port, function () { 
  console.log("MAIN Server started at port: ", port);
});
server.timeout = 2147483647;


