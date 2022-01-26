const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "ids-table";
const backetName = "cymotive";
const S3 = new AWS.S3();
const { nanoid } = require("nanoid");
/* 
  Save json data
*/

exports.handler = async (event) => {
  console.log("Report was uploaded");
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, " ")
  );
  const params = {
    Bucket: bucket,
    Key: key,
  };
  await returnJsonFromFile(params);
};

const returnJsonFromFile = async (params) => {
  await S3.getObject(params)
    .promise()
    .then(async (response) => {
      await storeJsonInDynamo(JSON.parse(response.Body));
    })
    .catch((err) => {
      console.log(err);
    });
};

const storeJsonInDynamo = async (data) => {
  const newReport = {
    reportId: nanoid(),
    numberOfAnomalies: returnNumberOfAnomalies(data.report.signalsPerMinute),
    ...data.report,
  };
  await dynamoDb
    .put({ TableName: TABLE_NAME, Item: newReport })
    .promise()
    .then(() => {
      console.log(`vehicle - ${data.report.vehicleId} - was added to db`);
    })
    .catch((err) => {
      console.log(
        `failed to add vehicle - ${data.report.vehicleId} - to db. Error: ${err}`
      );
    });
};

const returnNumberOfAnomalies = (obj) => {
  const reportAnomalies = [obj.infotainment, obj.windows, obj.airBag];
  const numberOfAnomalies = [];
  reportAnomalies.forEach((item) => {
    if (
      item.sum > item.acceptableMaxValue ||
      item.sum < item.acceptableMinValue
    ) {
      numberOfAnomalies.push(item);
    }
  });
  return numberOfAnomalies.length;
};
