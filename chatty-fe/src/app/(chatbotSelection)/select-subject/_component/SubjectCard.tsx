import React from 'react';
import { Subject } from '@/app/_types/subject';
import * as styles from './styles/subjectCard.css';
import CheckButton from './CheckButton';
type SubjectCardProps = {
  subject: Subject;
  onClick: () => void;
};

export default function SubjectCard({ subject, onClick }: SubjectCardProps) {
  return (
    <div
      className={styles.container({ selected: subject.selected })}
      onClick={onClick}
    >
      <CheckButton subject={subject} />
      {subject.koreanTitle}
    </div>
  );
}
