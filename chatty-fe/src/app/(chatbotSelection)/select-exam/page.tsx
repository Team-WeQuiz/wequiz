'use client';
import React, { useState } from 'react';
import Layout from '../_layout';
import Button from '../_component/Button';
import * as styles from './selectExam.css';
import ExamCard from './_component/ExamCard';
import { Exam } from '@/app/_types/exam';

export default function SelectExam() {
	const [isSelected, setIsSelected] = useState(false);
	const [exams, setExams] = useState<Exam[]>([
		{
			title: '수능',
			selected: false,
		},
		{
			title: '내신',
			selected: false,
		},
	]);
	const handleOnClick = (i: number) => {
		const newState = exams.map((exam, index) => {
			if (index === i) {
				return { ...exam, selected: !exam.selected };
			}
			return { ...exam, selected: false };
		});
		setExams(newState);
		setIsSelected(newState.some((exam) => exam.selected));
	};
	return (
		<Layout title='어떤 시험을 준비하고 계신가요?' progress={2}>
			<div className={styles.cardWrapper}>
				{exams.map((exam, i) => (
					<ExamCard exam={exam} onClick={() => handleOnClick(i)} key={i} />
				))}
			</div>
			<Button isSelected={isSelected} message={'선택 했어요!'} step={2} />
		</Layout>
	);
}
