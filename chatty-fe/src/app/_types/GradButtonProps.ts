export type GradButtonProps = {
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
  rounded?: boolean;
  fullWidth?: boolean;
  color?: 'primary' | 'secondary';
};
