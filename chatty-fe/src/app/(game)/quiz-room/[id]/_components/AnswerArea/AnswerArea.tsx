import React, { useState } from 'react';
import * as styles from './AnswerArea.css';
import TextInputField from '@/app/_components/TextInputField';

export default function AnswerArea() {
  const [answer, setAnswer] = useState('');
  return (
    <div className={styles.Container}>
      <h1 className={styles.Answer}>A.</h1>
      <div className={styles.Wrapper}>
        <TextInputField
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="답변을 작성해주세요."
          borderRadius={12}
        />
      </div>
    </div>
  );
}
