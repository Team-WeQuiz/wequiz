import { HttpResponse, http } from 'msw';
import { Subject } from '../_types/subject';

export const handlers = [
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
];
