import Modal from '@/app/_components/Modal/Modal';

const PasswordModal = ({
  name,
  isOpen,
  onClose,
}: {
  name: string | undefined;
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>{name}</div>
      <div>비밀번호를 입력해 주세요.</div>
    </Modal>
  );
};

export default PasswordModal;
