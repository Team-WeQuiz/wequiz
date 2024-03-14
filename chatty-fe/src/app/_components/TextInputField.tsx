'use client';
import React, { useRef } from 'react';
import * as styles from './TextInputField.css';
import Image from 'next/image';

type TextInputFiledProps = {
  placeholder?: string;
  borderRadius?: number;
  backgroundColor?: string;
  required?: boolean;
  isChat?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function TextInputField({
  placeholder = '',
  borderRadius,
  backgroundColor,
  required = false,
  isChat = false,
  value,
  onChange,
}: TextInputFiledProps) {
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
          value={value}
          onChange={onChange}
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
        value={value}
        onChange={onChange}
        className={`${styles.container}`}
        style={{
          borderRadius: `${borderRadius}px`,
          backgroundColor: `${backgroundColor}`,
        }}
      />
    );
  }
}
