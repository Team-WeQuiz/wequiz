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
  endAdornment?: React.ReactNode;
  type?: string;
  autoComplete?: string;
  disabled?: boolean;
};

export default function TextInputField({
  placeholder = '',
  borderRadius,
  backgroundColor,
  required = false,
  isChat = false,
  type,
  value,
  onChange,
  endAdornment,
  autoComplete,
  disabled,
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
          type={type}
          disabled={disabled}
        />
        {endAdornment && (
          <>
            <div className={styles.endAdornment}>{endAdornment}</div>
            <Image
              src="/images/Send_fill.svg"
              alt="send"
              width={48}
              height={48}
            />
          </>
        )}
      </div>
    );
  } else {
    return (
      <div className={styles.defaultInput}>
        <input
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          type={type}
          autoComplete={autoComplete}
          disabled={disabled}
          className={`${styles.container}`}
          style={{
            borderRadius: `${borderRadius}px`,
            backgroundColor: `${backgroundColor}`,
          }}
        />
        {endAdornment && (
          <div className={styles.endAdornment}>{endAdornment}</div>
        )}
      </div>
    );
  }
}
