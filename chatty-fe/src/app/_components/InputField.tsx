import React from 'react';
import * as styles from './InputField.css';

type InputFiledProps = {
  placeholder: string;
  size: 'small' | 'medium' | 'large';
};

export default function InputField({ placeholder, size }: InputFiledProps) {
  return (
    <input
      placeholder={placeholder}
      className={`${styles.container} ${styles[size]}`}
    />
  );
}
