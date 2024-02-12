import { NextResponse } from 'next/server';

const exams = [
  {
    title: '수능',
  },
  {
    title: '내신',
  },
];

export async function GET() {
  try {
    return NextResponse.json({ status: 200, exams });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
