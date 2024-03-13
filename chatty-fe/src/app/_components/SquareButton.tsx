import React from 'react';
import { SquareButton } from '@/app/_types/SquareButton';
import * as styles from './SquareButton.css';
import LoadingCircular from './LoadingCircular';

const SquareButton = ({
  disabled,
  form,
  formaction,
  formenctype,
  formmethod,
  formnovalidate,
  formtarget,
  name,
  type,
  value,
  children,
  onClick,
  isLoading,
  fullWidth = false,
  color = 'primary',
}: SquareButton) => {
  return (
    <button
      type={type}
      form={form}
      formAction={formaction}
      formEncType={formenctype}
      formMethod={formmethod}
      formNoValidate={formnovalidate}
      formTarget={formtarget}
      name={name}
      value={value}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`
        ${styles.squareButton}
        ${fullWidth && styles.fullWidth}
        ${isLoading && styles.loading}
        ${disabled && styles.disabled}
        ${color === 'primary' ? styles.primary : styles.secondary}
        `}
    >
      {children}
      {isLoading && (
        <div
          className={`${styles.loadingContainer}`}
        >
          <LoadingCircular />
        </div>
      )}
    </button>
  );
};

export default SquareButton;
