import { APIGatewayProxyHandlerV2WithJWTAuthorizer } from "aws-lambda";
import { Bucket } from "sst/node/bucket";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
const s3 = new S3Client({});

export const main: APIGatewayProxyHandlerV2WithJWTAuthorizer = async (
  event
) => {
  const fileName = event.pathParameters?.replay;
  if (!fileName) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "text/plain" },
      body: "Missing replay file name",
    };
  }

  if (!event.body) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "text/plain" },
      body: "Missing file",
    };
  }

  // Upload a file to the bucket
  await s3.send(
    new PutObjectCommand({
      Bucket: Bucket.ReplayBucket.bucketName,
      Key: fileName,
      Body: Buffer.from(event.body, "base64"),
    })
  );
  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: `${event.requestContext.authorizer.jwt.claims.sub}`,
  };
};
