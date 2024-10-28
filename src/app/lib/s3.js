// src/lib/s3.js
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const uploadFile = async (file) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${Date.now()}-${file.originalname}`, // Nome univoco del file
    Body: file.buffer,
    ACL: 'private', // Accesso privato
    ContentType: file.mimetype,
  };

  return s3.upload(params).promise();
};

export const getSignedUrl = (key) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Expires: 60 * 5, // URL valido per 5 minuti
  };

  return s3.getSignedUrl('getObject', params);
};
