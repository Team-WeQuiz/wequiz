import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	const url: string[] = [];
	try {
		const req = request.json();
		return NextResponse.json({ status: 200, req });
	} catch (error) {
		return NextResponse.json({ error });
	}
}
