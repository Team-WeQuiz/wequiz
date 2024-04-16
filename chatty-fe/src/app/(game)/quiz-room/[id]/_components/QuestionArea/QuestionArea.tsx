import React from 'react';
import * as styles from './QuestionArea.css';

type QuestionAreaProps = {
  contents: string;
};

export default function QuestionArea({ contents }: QuestionAreaProps) {
  return (
    <div className={styles.Container}>
      <h1 className={styles.Question}> Q. </h1>
      <div className={styles.TextBox}>{contents}</div>
    </div>
  );
}
