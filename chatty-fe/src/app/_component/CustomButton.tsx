import { CustomButton } from '../_types/customButton';
import * as styles from './styles/customButton.css';

const CustomButton = ({
  variant = 'text',
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
}: CustomButton) => {
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
      className={`${styles.container} ${styles[variant]}`}
    >
      {children}
    </button>
  );
};

export default CustomButton;
