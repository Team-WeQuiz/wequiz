import Modal from '@/app/_components/Modal/Modal';
import { useEffect } from 'react';

const NicknameModal = ({
  name,
  isOpen,
  onClose,
}: {
  name: string | undefined;
  isOpen: boolean;
  onClose: () => void;
}) => {
  useEffect(() => {
    console.log('inside nickname modal isOpen: ', isOpen);
  }, [isOpen]);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>{name}</div>
      <div>닉네임을 설정해 주세요.</div>
    </Modal>
  );
};

export default NicknameModal;
