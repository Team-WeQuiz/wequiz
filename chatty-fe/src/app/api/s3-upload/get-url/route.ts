import { getAWSAccessKeys } from '@/app/_lib/keys';
import { S3Client, UploadPartCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
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
    const command = new UploadPartCommand({
      Bucket,
      Key: body.data.fileName,
      PartNumber: body.data.partNumber,
      UploadId: body.data.uploadId,
    });
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return NextResponse.json(url);
  } catch (error) {
    console.error(error);
  }
}
