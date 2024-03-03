import { useState } from 'react';
import Modal from '../_component/Modal';

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return {
    Modal,
    isOpen,
    openModal,
    closeModal,
  };
};

export default useModal;
