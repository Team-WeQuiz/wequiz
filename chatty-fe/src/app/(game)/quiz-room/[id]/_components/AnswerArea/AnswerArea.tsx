'use client';
import React, { useEffect, useState } from 'react';
import * as styles from './AnswerArea.css';
import TextInputField from '@/app/_components/TextInputField';

type AnswerAreaProps = {
  type: '단답형' | '객관식';
  options?: string[];
  answer: string | null;
  setAnswer: (answer: string | null) => void;
  selectedOption: number | null;
  handleOptionChange: (option: string, index: number) => void;
};

export default function AnswerArea({
  type,
  options,
  answer,
  setAnswer,
  selectedOption,
  handleOptionChange,
}: AnswerAreaProps) {
  return (
    <div className={styles.Container}>
      <h1 className={styles.Answer}>A.</h1>
      <div className={styles.Wrapper}>
        {type === '단답형' ? (
          <TextInputField
            value={answer || ''}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="답변을 작성해주세요."
            borderRadius={12}
          />
        ) : (
          <div className={styles.RadioButtonWrapper}>
            {options?.map((option, index) => {
              const isSelected = index === selectedOption;
              return (
                <div className={styles.LabelWrapper} key={index}>
                  <input
                    className={
                      isSelected ? styles.SelectedButton : styles.RadioButton
                    }
                    type="button"
                    value={index + 1}
                    onClick={() => handleOptionChange(option, index)}
                    name="option"
                    id={option}
                  />
                  <label
                    className={isSelected ? styles.SelectedLabel : styles.Label}
                    htmlFor={option}
                  >
                    {option}
                  </label>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
