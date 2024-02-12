'use client';

import React, { useEffect, useState } from 'react';
import * as styles from './selectSubject.css';
import SubjectCard from './_component/SubjectCard';
import Button from '../_component/Button';
import { Subject } from '../../_types/subject';
import Layout from '../_layout';
export default function SelectSubject() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isSelected, setIsSelected] = useState(false);
  const fetchSubjects = async () => {
    try {
      const response = await fetch(`/api/subjects`);
      const res = await response.json();
      const data: Subject[] = res.subjects;
      console.log('data: ', data);
      const initializedSubjects = data.map((subject) => ({
        ...subject,
        selected: false,
      }));
      setSubjects(initializedSubjects);
    } catch (error) {
      console.log('error: ', error);
    }
  };
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

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <Layout title="어떤 과목을 공부하고 계신가요?" progress={1}>
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
