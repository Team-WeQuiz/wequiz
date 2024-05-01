'use client';

import { useEffect, useState } from 'react';
import MainLobby from '../../main-lobby/page';
import useModal from '@/app/_hooks/useModal';
import { useRouter } from 'next/navigation';

const EnterRoomPage = ({
  params: { id: roomId },
}: {
  params: { id: number };
}) => {
  const { Modal, isOpen, openModal, closeModal } = useModal();
  const [isLocked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    openModal();
  }, []);

  const handleBack = () => {
    closeModal();
    router.push('/main-lobby');
  };
  return (
    <>
      <MainLobby />
      {isLocked ? (
        <Modal isOpen={isOpen} onClose={handleBack}>
          비밀번호 입력 모달 for roomId: {roomId}
        </Modal>
      ) : (
        <Modal isOpen={isOpen} onClose={handleBack}>
          닉네임 입력 모달 for roomId: {roomId}
        </Modal>
      )}
    </>
  );
};

export default EnterRoomPage;
