import React from 'react';
import * as styles from './QuestionMaker.css';

type QuestionMakerProps = {
  questionType: 'list' | 'create';
  setQuestionType: (value: 'list' | 'create') => void;
};

export default function QuestionMaker({
  questionType,
  setQuestionType,
}: QuestionMakerProps) {
  return (
    <div className={styles.Container}>
      <div className={styles.RadioWrapper}>
        <div
          className={
            questionType === 'create'
              ? styles.RadioContainerChecked
              : styles.RadioContainer
          }
        >
          <input
            type="radio"
            id="create"
            name="questionType"
            value="create"
            onChange={() => setQuestionType('create')}
            checked={questionType === 'create'}
          />
          <label htmlFor="create">직접 제작</label>
        </div>
        <div
          className={
            questionType === 'list'
              ? styles.RadioContainerChecked
              : styles.RadioContainer
          }
        >
          <input
            type="radio"
            id="list"
            name="questionType"
            value="list"
            onChange={() => setQuestionType('list')}
            checked={questionType === 'list'}
          />
          <label htmlFor="list">리스트 선택</label>
        </div>
      </div>
    </div>
  );
}
