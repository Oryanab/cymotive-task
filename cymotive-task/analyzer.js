require("dotenv").config();
const AWS = require("aws-sdk");
const credentials = new AWS.Credentials(
  process.env.ACCESS_KEY_ID,
  process.env.SECRET_ACCESS_KEY
);
AWS.config.update({ credentials: credentials, region: "eu-central-1" });
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "ids-table";

// PATHS
const getHealth = "/get/health";
const numberOfReports = "/get/number-of-reports";
const numberOfVehicles = "/get/number-of-vehicles";
const numberOfAnomalies = "/get/number-of-anomalies";

// Events
exports.handler = async (event) => {
  console.log("Request event: ", event);
  let response;
  switch (true) {
    case event.httpMethod === "GET" && event.path === getHealth:
      response = buildResponse(200);
      break;
    case event.httpMethod === "GET" && event.path === numberOfReports:
      response = await returnNumberOfReports();
      break;
    case event.httpMethod === "GET" && event.path === numberOfVehicles:
      response = await returnNumberOfVehicles();
      break;
    case event.httpMethod === "GET" && event.path === numberOfAnomalies:
      response = await returnNumberOfAnomalies();
      break;
    default:
      response = buildResponse(404, "404 not found");
  }
  return response;
};

//buildResponse
const buildResponse = (statusCode, body) => {
  return {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers":
        "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
      "Access-Control-Allow-Methods": "OPTIONS,POST",
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Origin": "*",
      "X-Requested-With": "*",
    },
    body: JSON.stringify(body),
  };
};

// returnNumberOfReports
const returnNumberOfReports = async () => {
  const params = {
    TableName: TABLE_NAME,
  };
  return await dynamoDb
    .scan(params)
    .promise()
    .then((response) => {
      return buildResponse(200, {
        status: "success",
        "Number Of Reports": response.Count,
      });
    })
    .catch((error) => {
      return buildResponse(401, {
        status: "failure",
        error,
      });
    });
};
//returnNumberOfReports();

// returnNumberOfVehicles
const returnNumberOfVehicles = async () => {
  const params = {
    TableName: TABLE_NAME,
  };
  return await dynamoDb
    .scan(params)
    .promise()
    .then((response) => {
      return buildResponse(200, {
        status: "success",
        "Number Of Vehicles": returnUniqueCount(response.Items),
      });
    })
    .catch((error) => {
      return buildResponse(401, {
        status: "failure",
        error,
      });
    });
};
//returnNumberOfVehicles();

// Return unique cars:
function countUnique(iterable) {
  return new Set(iterable);
}
const returnUniqueCount = (reports) => {
  const uniqueId = [];
  countUnique(reports.map((item) => item.vehicleId)).forEach((item) =>
    uniqueId.push(item)
  );
  return uniqueId.length;
};

// numberOfAnomalies
const returnNumberOfAnomalies = async () => {
  const params = {
    TableName: TABLE_NAME,
  };
  return await dynamoDb
    .scan(params)
    .promise()
    .then((response) => {
      return buildResponse(200, {
        status: "success",
        "Number Of Anomalies": countAllAnomalies(response.Items),
      });
    })
    .catch((error) => {
      console.log(error);
    });
};
returnNumberOfAnomalies();

const countAllAnomalies = (tableContents) => {
  let countAnomalies = 0;
  tableContents.forEach((item) => (countAnomalies += item.numberOfAnomalies));
  return countAnomalies;
};
