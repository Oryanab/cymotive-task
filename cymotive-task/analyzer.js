require("dotenv").config();
const AWS = require("aws-sdk");
const credentials = new AWS.Credentials(
  process.env.ACCESS_KEY_ID,
  process.env.SECRET_ACCESS_KEY
);
const reports = require("./reports.json");
AWS.config.update({ credentials: credentials, region: "eu-central-1" });
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "ids-table";

// returnNumberOfReports
const returnNumberOfReports = async () => {
  const params = {
    TableName: TABLE_NAME,
  };
  return await dynamoDb
    .scan(params)
    .promise()
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};
//returnNumberOfReports();

// Return unique cars:
function countUnique(iterable) {
  return new Set(iterable);
}
const uniqueId = [];
countUnique(reports.map((item) => item.label)).forEach((item) =>
  uniqueId.push(item)
);
console.log(uniqueId.length);

//  return the number of signals that their ‘sum’ value is out of the acceptable range.

const returnNumberOfAnomilies = () => {
  const numberOfAnomalies = [];
  const allAnomalies = [];

  reports.forEach((report) => {
    const reportSignalsPerMinute = [
      {
        vehicleId: report.vehicleId,
        type: "infotainment",
        ...report.signalsPerMinute.infotainment,
      },
      {
        vehicleId: report.vehicleId,
        type: "infotainment",
        ...report.signalsPerMinute.airBag,
      },
      {
        vehicleId: report.vehicleId,
        type: "infotainment",
        ...report.signalsPerMinute.windows,
      },
    ];
    reportSignalsPerMinute.forEach((item) => allAnomalies.push(item));
  });

  allAnomalies.forEach((item) => {
    if (
      item.sum > item.acceptableMaxValue ||
      item.sum < item.acceptableMinValue
    ) {
      numberOfAnomalies.push(item);
    }
  });

  console.log(`${numberOfAnomalies.length}/${allAnomalies.length}`);
};

//returnNumberOfAnomilies();

// returnNumberOfReports
const tryStuff = async () => {
  const params = {
    TableName: TABLE_NAME,
    FilterExpression: "contains(signalsPerMinute, :signalsPerMinute)",
  };
  return await dynamoDb
    .query(params)
    .promise()
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};

tryStuff();
