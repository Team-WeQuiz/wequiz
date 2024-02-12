import React, { useEffect } from 'react';
import Check from '@/assets/icons/check.svg';
import * as styles from './styles/checkButton.css';
import { Subject } from '@/app/_types/subject';
import { globals } from '@/app/globals.css';

type CheckButtonProps = {
  subject: Subject;
};

export default function CheckButton({ subject }: CheckButtonProps) {
  // const handleColor = (subject: Subject) => {
  // 	if (subject.selected) {
  // 		switch (subject.englishTitle) {
  // 			case 'korean':
  // 				return globals.subjectColor.korean;
  // 			case 'english':
  // 				return globals.subjectColor.english;
  // 			case 'math':
  // 				return globals.subjectColor.math;
  // 			case 'history':
  // 				return globals.subjectColor.history;
  // 			case 'social':
  // 				return globals.subjectColor.social;
  // 			case 'science':
  // 				return globals.subjectColor.science;
  // 		}
  // 	}
  // };

  return <Check className={styles.check} />;
}
