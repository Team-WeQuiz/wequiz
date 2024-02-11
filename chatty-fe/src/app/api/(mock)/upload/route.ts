import { NextRequest, NextResponse } from 'next/server';

const url: string[] = [];
export async function POST(request: NextRequest) {
	try {
		const req = await request.json();
		url.push(req.url);
		return NextResponse.json({ status: 201, req, url });
	} catch (error) {
		return NextResponse.json({ error });
	}
}
