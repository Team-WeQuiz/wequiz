'use client';

import { useEffect, useState } from 'react';
import useModal from '@/app/_hooks/useModal';
import { QuizInfo } from '@/app/_types/QuizInfoType';
import { getQuizInfo } from '@/app/_api/quiz';
import useAuthStore from '@/app/_store/useAuthStore';
import BlockingModal from '../BlockingModal/BlockingModal';
import PasswordModal from '../PasswordModal/PasswordModal';
import NicknameModal from '../NicknameModal/NicknameModal';

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
    isFull: boolean;
    isLoading: boolean;
  }>({
    data: null,
    isLoading: true,
    isFull: false,
  });

  const [isLocked] = useState(false);
  const { accessToken } = useAuthStore();

  const fetchData = async () => {
    if (accessToken && id > 0) {
      try {
        const response = await getQuizInfo(id, accessToken);
        setRequestState((prev) => ({
          ...prev,
          data: response,
          isFull: response.maxPlayers <= response.numOfPlayers,
        }));
        openModal();
      } catch (error) {
        console.error('error: ', error);
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
        isFull: false,
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
        (requestState.isFull ? (
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
