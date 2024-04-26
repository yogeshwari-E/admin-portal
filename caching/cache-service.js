const Redis = require("ioredis");
var LZUTF8 = require("lzutf8");
const _ = require("underscore");
const fs = require("fs");

const sendMessageToQueueNode = require("../queue/sendMessageToQueueNode.api");
const domainPolicy = process.env.domainPolicy;

const config = require("../config/config_dev.json");
const getAPIJSON = require("./get-api.json");
const postAPIJSON = require("./post-api.json");

var redis_network_instance = process.env.redis_url;
const redisClient = new Redis(redis_network_instance);

module.exports.addDataToCache = (key, data) => {
  key = domainPolicy + key;
  //Compressing String to reduce the fetch response time from Redis
  let compressedData = LZUTF8.compress(JSON.stringify(data), {
    outputEncoding: "StorageBinaryString"
  });
  redisClient.set(key, compressedData, "EX", 864000);
  console.log("+++ Cached - " + key + " +++");
};

module.exports.getDataFromCache = (key, callback) => {
  key = domainPolicy + key;
  console.log(key);
  redisClient.get(key, (error, cachedData) => {
    if (error) throw error;
    if (cachedData && cachedData != null) {
      // console.log("Cached data found");
      var decompressed = LZUTF8.decompress(cachedData, {
        inputEncoding: "StorageBinaryString",
        outputEncoding: "String"
      });
      callback(null, JSON.parse(decompressed));
    } else {
      console.log("+++ No cached data found +++ " + key);
      callback(null, {});
    }
  });
};


module.exports.addDataToCacheByExpiryLimit = (key, data,limit) => {
  key = domainPolicy + key;
  let compressedData = LZUTF8.compress(JSON.stringify(data), {
    outputEncoding: "StorageBinaryString"
  });
  redisClient.set(key, compressedData, "EX", limit);
  console.log("+++ Cached - " + key + " +++");
};


module.exports.deleteCacheKeysByPrefix = async (key) => {
  key = domainPolicy + key;
  const keys = await redisClient.keys(`${key}*`);
  const pipeline = redisClient.pipeline();
  keys.forEach((key) => pipeline.del(key));
  await pipeline.exec();
  console.log(`Deleted ${key} patterned keys`);
};

module.exports.returnDataFromCache = (req, res, next) => {
  let key = req.originalUrl || req.url;
  key = key.split("&")[0];
  key = key.split(",")[0];
  key = domainPolicy + key;

  let userid = req._id;
  userkey = `${key}/${userid}`;

  if (userkey.includes("getmultiwidget") && userkey.includes("656fecebc7202d31b8e4f264")) next();
  else {
    redisClient.get(userkey, (error, cachedData) => {
      if (error) throw error;
      // console.log(cachedData);
      if (cachedData && cachedData != null) {
        // console.log("Cached data found");
        var decompressed = LZUTF8.decompress(cachedData, {
          inputEncoding: "StorageBinaryString",
          outputEncoding: "String"
        });
        console.log("+++ Cached data found +++ " + userkey);
        return res.status(200).json(JSON.parse(decompressed));
      } else {
        redisClient.get(key, (error, cachedData) => {
          if (error) throw error;
          // console.log(cachedData);
          if (cachedData && cachedData != null) {
            // console.log("Cached data found");
            var decompressed = LZUTF8.decompress(cachedData, {
              inputEncoding: "StorageBinaryString",
              outputEncoding: "String"
            });
            console.log("+++ Cached data found +++ " + key);
            return res.status(200).json(JSON.parse(decompressed));
          } else {
            console.log("+++ No cached data found +++ " + key);
            next();
          }
        });
      }
    });
  }
};

module.exports.updateCacheData = (projectid, project, dbURL, api, userid) => {
  var matchedElement = _.filter(postAPIJSON, function (dt) {
    if (dt.title) return api.split("?")[0].includes(dt.title);
  });

  var getapiurls = [];
  if (matchedElement.length > 0) {
    for (var i = 0; i < matchedElement[0].tags.length; i++) {
      var matchedData = _.filter(getAPIJSON, function (dt) {
        return dt.tags.includes(matchedElement[0].tags[i]);
      });

      if (matchedData.length > 0) {
        for (var j = 0; j < matchedData.length; j++) {
          getapiurls.push(domainPolicy + matchedData[j].title);
        }
      }
    }
  }

  sendMessageToQueueNode.getResponse("workitem_update", userid, projectid, {
    project: project,
    dbURL: dbURL,
    apis: getapiurls
  });
};

module.exports.deleteCacheDependent = (projectid, api) => {
  var matchedElement = _.filter(postAPIJSON, function (dt) {
    if (dt.title) return api.split("?")[0].includes(dt.title);
  });
  let getapiurls = [];
  if (matchedElement.length > 0) {
    for (var i = 0; i < matchedElement[0].tags.length; i++) {
      var matchedData = _.filter(getAPIJSON, function (dt) {
        return dt.tags.includes(matchedElement[0].tags[i]);
      });

      if (matchedData.length > 0) {
        for (var j = 0; j < matchedData.length; j++) {
          getapiurls.push(`${matchedData[j].title}*?project=${projectid}`);
        }
      }
    }
  }
  getapiurls = [...new Set(getapiurls)];
  for (let getapi of getapiurls) {
    this.deleteCacheKeysByPrefix(getapi);
  }
};

// Below is a Write Through Approach
module.exports.updateDataInCache = async (key, newData) => {
  redisClient.get(key, (err, compressedData) => {
    if (err) {
      console.error("Error retrieving data from Redis:", err);
      return;
    }
    if (compressedData) {
      try {
        let existingData = JSON.parse(
          LZUTF8.decompress(compressedData, { inputEncoding: "StorageBinaryString" })
        );
        Object.assign(existingData, newData);

        let updatedCompressedData = LZUTF8.compress(JSON.stringify(existingData), {
          outputEncoding: "StorageBinaryString"
        });
        redisClient.set(key, updatedCompressedData, "EX", 864000);
      } catch (parseError) {
        console.error("Error parsing existing data from Redis:", parseError);
      }
    } else {
      console.log(`+++ Cache entry not found for key - ${key} +++`);
    }
  });
};



module.exports.getDataFromCacheAsync = async (key) => {
  try {
    let finalData = await redisClient.get(key);

    if (finalData) {
      var decompressed = LZUTF8.decompress(finalData, {
        inputEncoding: "StorageBinaryString",
        outputEncoding: "String"
      });
      finalData = JSON.parse(decompressed);
      return finalData;
    } else return null;
  } catch (err) {
    console.log(err);
  }
};

module.exports.deleteKeysWithLocalhost = async () => {
  try {
    const keys = await redisClient.keys(`Localhost*`);

    console.log("keys",keys)

    // const pipeline = redisClient.pipeline();

    // keys.forEach((key) => {
    //   pipeline.del(key);

    //   const newKey = key.replace('Localhost', 'app');
    //   pipeline.del(newKey);

    //   console.log("++++++++++++++", newKey);
    // });

    // await pipeline.exec(); // Execute the pipeline to delete keys

    return keys;
  } catch (error) {
    throw error;
  }
};

