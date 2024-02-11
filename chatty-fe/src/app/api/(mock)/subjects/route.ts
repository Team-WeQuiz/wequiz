import { NextResponse } from 'next/server';

const subjects = [
	{
		koreanTitle: '국어',
		englishTitle: 'korean',
	},
	{
		koreanTitle: '수학',
		englishTitle: 'math',
	},
	{
		koreanTitle: '영어',
		englishTitle: 'english',
	},
	{
		koreanTitle: '한국사',
		englishTitle: 'history',
	},
	{
		koreanTitle: '사탐',
		englishTitle: 'social',
	},
	{
		koreanTitle: '과탐',
		englishTitle: 'science',
	},
];

export async function GET() {
	try {
		return NextResponse.json({ status: 200, subjects });
	} catch (error) {
		return NextResponse.json({ error });
	}
}
