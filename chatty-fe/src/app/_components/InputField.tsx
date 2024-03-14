import React, { useRef } from 'react';
import * as styles from './InputField.css';
import Image from 'next/image';

type InputFiledProps = {
  placeholder?: string;
  borderRadius?: number;
  backgroundColor?: string;
  required?: boolean;
  isChat?: boolean;
};

export default function InputField({
  placeholder = '',
  borderRadius,
  backgroundColor,
  required = false,
  isChat = false,
}: InputFiledProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleChatDivClick = () => {
    inputRef.current?.focus();
  };
  if (isChat) {
    return (
      <div
        onClick={handleChatDivClick}
        className={styles.chatContainer}
        style={{
          borderRadius: `${borderRadius}px`,
          backgroundColor: `${backgroundColor}`,
        }}
      >
        <input
          ref={inputRef}
          placeholder={placeholder}
          required={required}
          className={styles.chatInput}
        />
        <Image src="/images/Send_fill.svg" alt="send" width={48} height={48} />
      </div>
    );
  } else {
    return (
      <input
        placeholder={placeholder}
        required={required}
        className={`${styles.container}`}
        style={{
          borderRadius: `${borderRadius}px`,
          backgroundColor: `${backgroundColor}`,
        }}
      />
    );
  }
}
