'use client';

import { useState } from 'react';
import MainLobby from '../../main-lobby/page';
import Modal from '@/app/_components/Modal/Modal';
import { useRouter } from 'next/navigation';

const EnterRoomPage = ({
  params: { id: roomId },
}: {
  params: { id: number };
}) => {
  const [isLocked] = useState(false);
  const router = useRouter();

  const handleBack = () => {
    router.push('/main-lobby');
  };
  return (
    <>
      <MainLobby />
      {isLocked ? (
        <Modal isOpen={true} onClose={handleBack}>
          비밀번호 입력 모달 for roomId: {roomId}
        </Modal>
      ) : (
        <Modal isOpen={true} onClose={handleBack}>
          닉네임 입력 모달 for roomId: {roomId}
        </Modal>
      )}
    </>
  );
};

export default EnterRoomPage;
