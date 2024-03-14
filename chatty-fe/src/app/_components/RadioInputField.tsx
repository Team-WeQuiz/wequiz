import React from 'react';
import * as styles from './RadioInputField.css';

type Option = {
  value: string;
  label: string;
};

type RadioInputFieldProps = {
  name: string;
  options: Option[];
  selectedValue: string;
  onChange: (value: string) => void;
};

export default function RadioInputField({
  name,
  options,
  selectedValue,
  onChange,
}: RadioInputFieldProps) {
  return (
    <div className={styles.container}>
      {options.map((option) => (
        <div className={styles.labelContainer} key={option.value}>
          <label
            key={option.value}
            className={`${styles.label} ${selectedValue === option.value ? styles.selectedLabel : ''}`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={() => onChange(option.value)}
            />
            {option.label}
          </label>
        </div>
      ))}
    </div>
  );
}
