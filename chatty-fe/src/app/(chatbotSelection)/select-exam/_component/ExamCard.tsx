import React from 'react';
import * as styles from './styles/examCard.css';
import { Exam } from '@/app/_types/exam';

type ExamCardProps = {
	exam: Exam;
	onClick: () => void;
};

export default function ExamCard({ exam, onClick }: ExamCardProps) {
	return (
		<div className={styles.card({ selected: exam.selected })} onClick={onClick}>
			{exam.title === '수능' ? (
				<>
					<div>
						{`"`}수능/모의고사{`"`}
					</div>
					<div>준비하고 있어요!</div>
				</>
			) : (
				<>
					<div>
						{`"`}학교 자체시험(내신){`"`}
					</div>
					<div>준비하고 있어요!</div>
				</>
			)}
		</div>
	);
}
