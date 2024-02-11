import { HttpResponse, http } from 'msw';
import { Subject } from '../_types/subject';

const allPosts: string[] = [];

export const handlers = [
	// 과목 모킹
	http.get('/api/subjects', () => {
		const contents = [
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
		return HttpResponse.json(contents);
	}),

	// 시험 종류 리스트 모킹
	http.get('/api/exams', () => {
		const contents = [
			{
				title: '수능',
			},
			{
				title: '내신',
			},
		];
		return HttpResponse.json(contents);
	}),

	// 업로드 url post 모킹
	http.post('/api/upload', async ({ request }) => {
		const newPost = await request.json();

		return HttpResponse.json(newPost, { status: 201 });
	}),
];
