const AWS = require("aws-sdk");
const S3 = new AWS.S3();

// PATHS
const healthRoute = "/health";
const baseUrl = "/";

// Const
const backetName = "cymotive";

// Events
exports.handler = async (event) => {
  console.log("Request event: ", event);
  let response;
  switch (true) {
    case event.httpMethod === "GET" && event.path === healthRoute:
      response = buildResponse(200);
      break;
    case event.httpMethod === "POST" && event.path === baseUrl:
      response = await addReportToBucket(JSON.parse(event.body).reports);
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

// Functions
const addReportToBucket = async (reports) => {
  try {
    for (let report of reports) {
      await S3.putObject({
        Bucket: backetName,
        Key: `${report.vehicleId}.json`,
        Body: JSON.stringify({ report }),
      })
        .promise()
        .then(() => {
          console.log({ status: "success", report: report });
        })
        .catch((err) => console.log({ status: "failure", error: err }));
    }
    return buildResponse(200, { status: "success", reports: reports });
  } catch (err) {
    return buildResponse(200, {
      status: "failure",
      reports: reports,
      error: err,
    });
  }
};

// const addReportToBucket = async (report) => {
//   console.log(report);
//   await S3.putObject({
//     Bucket: backetName,
//     Key: `${report.vehicleId}.json`,
//     Body: JSON.stringify(report),
//   })
//     .promise()
//     .then(() => {
//       console.log(buildResponse(200, { status: "success", report }));
//       return buildResponse(200, { status: "success", report });
//     })
//     .catch((err) => {
//       console.log(
//         buildResponse(200, {
//           status: "failure",
//           error: err,
//         })
//       );
//       return buildResponse(200, {
//         status: "failure",
//         error: err,
//       });
//     });
// };

// Functions
