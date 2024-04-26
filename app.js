
const configJS = require("./config/config");
start();

async function start() {
  await configJS.formulateconfig();

  require("./index")
}

