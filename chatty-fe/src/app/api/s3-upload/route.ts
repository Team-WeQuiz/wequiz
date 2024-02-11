import {
	S3Client,
	PutObjectCommand,
	GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
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
			return NextResponse.json({ status: 400, error: 'No file uploaded' });
		}
		const fileOriginalName = file.name;
		const fileName = Date.now() + '-' + fileOriginalName;
		const Body = (await file.arrayBuffer()) as Buffer;
		s3.send(new PutObjectCommand({ Bucket, Key: fileName, Body }));
		const getCommand = new GetObjectCommand({ Bucket, Key: fileName });
		const preUrl = await getSignedUrl(s3, getCommand, { expiresIn: 3600 });

		return NextResponse.json({ status: 200, preUrl });
	} catch (error) {
		return NextResponse.json({ error });
	}
}
