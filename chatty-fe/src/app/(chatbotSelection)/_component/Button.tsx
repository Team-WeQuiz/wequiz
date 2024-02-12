import React from 'react';
import * as styles from './styles/button.css';
import { useRouter } from 'next/navigation';

type ButtonProps = {
  isSelected: boolean;
  message: string;
  step: number;
  buttonClick?: () => void;
};

export default function Button({
  isSelected,
  message,
  step,
  buttonClick,
}: ButtonProps) {
  const navigate = useRouter();
  const handleOnClick = () => {
    buttonClick ? buttonClick() : null;
    if (step === 1) {
      navigate.push('/select-exam');
    }
    if (step === 2) {
      navigate.push('/upload-file');
    }
    if (step === 3) {
      navigate.push('/chatbot-list');
    }
  };
  return (
    <button
      className={styles.button({
        selected: isSelected,
      })}
      onClick={handleOnClick}
      disabled={!isSelected}
    >
      {message}
    </button>
  );
}
