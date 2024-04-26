var env = process.env.NODE_ENV || "localserver";

var config, vault_config;

const run = async (vault_config) => {
  const vault = require("node-vault")({
    apiVersion: vault_config.apiversion,
    endpoint: vault_config.endpoint
  });

  const result = await vault.approleLogin({
    role_id: vault_config.roleid,
    secret_id: vault_config.secretid
  });

  vault.token = result.auth.client_token; // Add token to vault object for subsequent requests.

  const { data } = await vault.read(vault_config.path);

  config = data.data;
};

async function trySwitch(env) {
  switch (env) {
    case "localserver":
      config = require("./config_localserver.json");
      console.log("localserver");
      break;
    case "development":
      config = require("./config_dev.json");
      break;
    case "localhost":
      config = require("./config_localhost.json");
      break;
    case "quality":
      // vault_config = require("./vault_quality.json");
      // await run(vault_config);
      config = require("./config_quality.json");
      break;
    case "beta":
      // vault_config = require("./vault_quality.json");
      // await run(vault_config);
      config = require("./config_quality.json");
    case "production":
      config = require("./config_app.json");
      break;
    case "digital":
      config = require("./config_digital.json");
      break;
    case "demo":
      config = require("./config_demo.json");
      break;
    case "alpha":
      config = require("./config_alpha.json");
      break;
    default:
      config = require("./config_localserver.json");
      break;
  }
}


module.exports. formulateconfig = async () => {
  await trySwitch (env) ;
  var envConfig = JSON.parse(JSON.stringify(config));

  
  module.exports = {
    creds: {
      redirectUrl: "http://localhost:3000/api/token",
      clientID: "b4e4623f-11e1-4b17-9427-213854e4663e",
      clientSecret: "pmimZFZC730=_asiTRY46{;",
      identityMetadata:
        "https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration",
      allowHttpForRedirectUrl: true,
      responseType: "code",
      validateIssuer: false,
      responseMode: "query",
      scope: ["User.Read"]
    }
  };

  Object.keys(envConfig).forEach((key) => (process.env[key] = envConfig[key]));

  return true;
  
}