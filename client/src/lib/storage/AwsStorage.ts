import AWS from "aws-sdk";

import { Storage } from "./Storage";

const REGION = "eu-central-1";
const AWS_URL = process.env.AWS_URL || "";
const BUCKET = process.env.BUCKET || "";
const AWS_ACCESS_KEY_ID = process.env.AWS_KEY || "";
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET || "";
const s3 = new AWS.S3({
  region: REGION,
  signatureVersion: "v4",
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

export class AWSStorage implements Storage {
  getObjectPathURL(path: string): string {
    return `${AWS_URL}/${path}`;
  }

  getObjectURL(path: string): string {
    return `${AWS_URL}/${path}`;
  }
  async getObject(path: string): Promise<string> {
    const object = await s3
      .getObject({ Bucket: BUCKET, Key: `${path}` })
      .promise();
    return object.Body as string;
  }

  async objectExits(path: string): Promise<boolean> {
    return new Promise((res) => {
      s3.headObject({ Bucket: BUCKET, Key: `${path}` }, (err, data) => {
        if (err || !data) {
          res(false);
          return;
        }
        res(Boolean(data.ContentLength));
      });
    });
  }

  async writeObject(data: string | Buffer, path: string): Promise<void> {
    await s3
      .putObject({
        Body: data,
        Bucket: BUCKET,
        ContentType: "image/jpeg",
        Key: path,
        CacheControl: "public, max-age=86400",
      })
      .promise();
  }
}
