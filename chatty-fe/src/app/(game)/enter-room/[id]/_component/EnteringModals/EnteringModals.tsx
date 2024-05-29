'use client';

import { useEffect, useState } from 'react';
import useModal from '@/app/_hooks/useModal';
import { QuizInfo } from '@/app/_types/QuizInfoType';
import { getQuizInfo } from '@/app/_api/quiz';
import useAuthStore from '@/app/_store/useAuthStore';
import BlockingModal from '../BlockingModal/BlockingModal';
import PasswordModal from '../PasswordModal/PasswordModal';
import NicknameModal from '../NicknameModal/NicknameModal';
import { useRouter } from 'next/navigation';

const EnteringModals = ({
  id,
  goingBack,
}: {
  id: number;
  goingBack: () => void;
}) => {
  const { isOpen, openModal, closeModal } = useModal();
  const [requestState, setRequestState] = useState<{
    data: QuizInfo | null;
    isLoading: boolean;
  }>({
    data: null,
    isLoading: true,
  });

  const [isLocked] = useState(false);
  const { accessToken } = useAuthStore();

  const router = useRouter();

  const fetchData = async () => {
    if (accessToken && id > 0) {
      try {
        const response = await getQuizInfo(id, accessToken);
        setRequestState((prev) => ({
          ...prev,
          data: response,
        }));
        openModal();
      } catch (error: any) {
        alert('퀴즈 방 정보를 불러오는데 실패했습니다.');
        router.push('/main-lobby');
      } finally {
        setRequestState((prev) => ({
          ...prev,
          isLoading: false,
        }));
      }
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchData();
    }
  }, [accessToken, id]);

  useEffect(() => {
    if (!isOpen) {
      setRequestState({
        data: null,
        isLoading: true,
      });
    }
  }, [isOpen]);

  const handleBack = () => {
    closeModal();
    goingBack();
  };

  return (
    <>
      {requestState.data &&
        (requestState.data.isFull ? (
          <BlockingModal
            name={requestState.data?.name}
            isOpen={isOpen}
            onClose={handleBack}
          />
        ) : isLocked ? (
          <PasswordModal
            name={requestState.data?.name}
            isOpen={isOpen}
            onClose={handleBack}
          />
        ) : (
          <NicknameModal
            name={requestState.data?.name}
            roomId={id}
            isOpen={isOpen}
            closeModal={closeModal}
            goingBack={goingBack}
          />
        ))}
    </>
  );
};

export default EnteringModals;
