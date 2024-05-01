import Modal from '@/app/_components/Modal/Modal';
import { useEffect } from 'react';

const BlockingModal = ({
  name,
  isOpen,
  onClose,
}: {
  name: string | undefined;
  isOpen: boolean;
  onClose: () => void;
}) => {
  useEffect(() => {}, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>{name}</div>
      <div>방이 다 찼습니다!</div>
    </Modal>
  );
};

export default BlockingModal;
