import {
  Stack,
  StackProps,
  aws_s3 as s3,
  aws_lambda as lambda,
  aws_dynamodb as dynamodb,
  aws_apigateway as apiGateway,
  aws_iam as iam,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import * as path from "path";

export class CdkServerlessAppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // S3 Bucket
    const reportsBucket = new s3.Bucket(this, "reports-bucket", {
      bucketName: "cymotive-task-bucket-cdk",
    });

    // dynamo db table
    const idsTable = new dynamodb.Table(this, "ids-table", {
      tableName: "ids-table",
      partitionKey: {
        name: "reportId",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "	vehicleId",
        type: dynamodb.AttributeType.STRING,
      },
    });

    // porter lambda
    const porter = new lambda.Function(this, "porter", {
      functionName: "porter-cdk",
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "files/porter.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "./files/porter")),
      environment: {
        BUCKET_NAME: reportsBucket.bucketName,
        BUCKET_ARN: reportsBucket.bucketArn,
      },
    });
  }
}
