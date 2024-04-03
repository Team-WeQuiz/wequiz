import { getAWSAccessKeys } from '@/app/_lib/keys';
import { S3Client, CreateMultipartUploadCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const keys = await getAWSAccessKeys();

    const Bucket = 'kyuyeon-test';
    const region = 'ap-northeast-2';
    const s3 = new S3Client({
      region,
      credentials: {
        accessKeyId: keys.accessKey,
        secretAccessKey: keys.secretAccessKey,
      },
    });
    const command = new CreateMultipartUploadCommand({
      Bucket,
      Key: body.data.fileName,
      ContentType: body.data.fileType,
    });
    const result = await s3.send(command);
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
  }
}
