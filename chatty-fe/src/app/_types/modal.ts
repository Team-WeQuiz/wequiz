export type Modal = {
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  confirmButton?: ModalButton;
};

export type ModalButton = {
  variant?: 'contained' | 'outlined' | 'text';
  text: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  form?: string;
  isLoading?: boolean;
};
