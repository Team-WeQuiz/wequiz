export type CustomButton = {
  variant?: 'contained' | 'outlined' | 'text';
  disabled?: boolean;
  form?: string;
  formaction?: string;
  formenctype?: string;
  formmethod?: string;
  formnovalidate?: boolean;
  formtarget?: string;
  name?: string;
  type?: 'button' | 'submit' | 'reset';
  value?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  isLoading?: boolean;
};
