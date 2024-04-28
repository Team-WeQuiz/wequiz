import React from 'react';
import * as styles from './AnswerArea.css';
import TextInputField from '@/app/_components/TextInputField';

type AnswerAreaProps = {
  type: '단답형' | '객관식';
  options?: string[];
  answer: string;
  setAnswer: (answer: string) => void;
};

export default function AnswerArea({
  type,
  options,
  answer,
  setAnswer,
}: AnswerAreaProps) {
  return (
    <div className={styles.Container}>
      <h1 className={styles.Answer}>A.</h1>
      <div className={styles.Wrapper}>
        {type === '단답형' ? (
          <TextInputField
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="답변을 작성해주세요."
            borderRadius={12}
          />
        ) : (
          <div className={styles.RadioButtonWrapper}>
            {options?.map((option, index) => {
              return (
                <label key={index}>
                  <input
                    type="radio"
                    value={option}
                    onChange={(e) => setAnswer(e.target.value)}
                    name="option"
                  />
                  {option}
                </label>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
