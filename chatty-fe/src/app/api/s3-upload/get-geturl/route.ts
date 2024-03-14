import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
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
    const command = new GetObjectCommand({ Bucket, Key: body.data.fileName });
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return NextResponse.json(url);
  } catch (error) {
    console.error(error);
  }
}
