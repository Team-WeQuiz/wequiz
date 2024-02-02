'use client';

import React, { useState } from 'react';
import * as styles from './selectSubject.css';
import SubjectCard from './_component/SubjectCard';
import Button from '../_component/Button';
import { Subject } from '../../_types/subject';
import Layout from '../_layout';
export default function SelectSubject() {
	const [subjects, setSubjects] = useState<Subject[]>([
		{
			koreanTitle: '국어',
			englishTitle: 'korean',
			selected: false,
		},
		{
			koreanTitle: '수학',
			englishTitle: 'math',
			selected: false,
		},
		{
			koreanTitle: '영어',
			englishTitle: 'english',
			selected: false,
		},
		{
			koreanTitle: '한국사',
			englishTitle: 'history',
			selected: false,
		},
		{
			koreanTitle: '사탐',
			englishTitle: 'social',
			selected: false,
		},
		{
			koreanTitle: '과탐',
			englishTitle: 'science',
			selected: false,
		},
	]);
	const [isSelected, setIsSelected] = useState(false);
	const handleOnClick = (i: number) => {
		const newState = subjects.map((subject, index) => {
			if (index === i) {
				return { ...subject, selected: !subject.selected };
			}
			return { ...subject, selected: false };
		});
		setSubjects(newState);
		setIsSelected(newState.some((subject) => subject.selected));
	};
	return (
		<Layout title='어떤 과목을 공부하고 계신가요?' progress={1}>
			<div className={styles.cardWrapper}>
				{subjects.map((subject, i) => (
					<SubjectCard
						subject={subject}
						key={i}
						onClick={() => handleOnClick(i)}
					/>
				))}
			</div>
			<Button isSelected={isSelected} message={'선택 했어요!'} step={1} />
		</Layout>
	);
}
