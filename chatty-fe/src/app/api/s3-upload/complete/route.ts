import { CompleteMultipartUploadCommand, S3Client } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';

const Bucket = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME as string;
const s3 = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY as string,
  },
});

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const command = new CompleteMultipartUploadCommand({
      Bucket,
      Key: body.data.fileName,
      UploadId: body.data.uploadId,
      MultipartUpload: {
        Parts: body.data.parts,
      },
    });
    const result = await s3.send(command);
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
  }
}
