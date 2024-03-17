import React from 'react';
import { GradButtonProps } from '@/app/_types/GradButtonProps';
import * as styles from './GradButton.css';
import LoadingCircular from './LoadingCircular';

const GradButton = ({
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
  color = 'primary',
  rounded = false,
  fullWidth = false,
}: GradButtonProps) => {
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
      className={styles.gradButton({
        color,
        rounded,
        fullWidth,
        isLoading,
        disabled: disabled || isLoading,
      })}
    >
      {children}
      {isLoading && (
        <div className={`${styles.loadingContainer}`}>
          <LoadingCircular />
        </div>
      )}
    </button>
  );
};

export default GradButton;
