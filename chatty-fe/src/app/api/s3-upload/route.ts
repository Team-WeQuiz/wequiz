import {
	S3Client,
	PutObjectCommand,
	ListObjectsCommand,
} from '@aws-sdk/client-s3';
import { NextRequest, NextResponse } from 'next/server';
const Bucket = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME as string;
const s3 = new S3Client({
	region: process.env.NEXT_PUBLIC_AWS_REGION,
	credentials: {
		accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY as string,
		secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY as string,
	},
});

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const file = formData.get('file');

		if (!(file instanceof File)) {
			return NextResponse.json({ status: 400 });
		}
		const fileName = file.name;
		const Body = (await file.arrayBuffer()) as Buffer;
		s3.send(new PutObjectCommand({ Bucket, Key: fileName, Body }));

		return NextResponse.json({ status: 200 });
	} catch (error) {
		console.error('Error processing request:', error);
		return NextResponse.json({ error });
	}
}
