import React from 'react';
import { SolidButtonProps } from '@/app/_types/SolidButtonProps';
import * as styles from './SolidButton.css';
import LoadingCircular from './LoadingCircular';

const SolidButton = ({
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
  shadowExist = true,
  fullWidth = false,
}: SolidButtonProps) => {
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
      className={`${styles.solidButton}
        ${shadowExist && styles.shadow}
        ${fullWidth && styles.fullWidth}
        ${isLoading && styles.loading}
        ${disabled && styles.disabled}
      `}
    >
      {children}
      {isLoading && (
        <div className={styles.loadingContainer}>
          <LoadingCircular />
        </div>
      )}
    </button>
  );
};

export default SolidButton;
