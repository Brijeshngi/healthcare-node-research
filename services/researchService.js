import AWS from "aws-sdk";

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

// 🔹 Utility: Anonymize record
export const anonymizeRecord = (record) => {
  const obj = record.toObject ? record.toObject() : record;

  // Remove patient identifiers
  delete obj.patient;
  delete obj._id;
  delete obj.createdAt;
  delete obj.updatedAt;

  // Add anonymization tag
  obj.anonymizedAt = new Date();
  return obj;
};

// 🔹 Upload to S3
export const uploadToS3 = async (bucket, key, data) => {
  const params = {
    Bucket: bucket,
    Key: key,
    Body: JSON.stringify(data, null, 2),
    ContentType: "application/json",
  };

  await s3.putObject(params).promise();
  return `s3://${bucket}/${key}`;
};
