'use client';

import GradButton from '@/app/_components/GradButton';
import { useEffect, useState } from 'react';
import useWaitingStore from '@/app/_store/useWaitingStore';
import { UserStatus } from '@/app/_types/WaitingStatus';
import stompClient from '../../../../_utils/stomp';
import * as styles from './ReadyButton.css';
import Image from 'next/image';
import useModal from '@/app/_hooks/useModal';
import TextInputField from '@/app/_components/TextInputField';

const ReadyButton = ({
  roomId,
  userId,
  isConnected,
  toggleBlock,
  code,
}: {
  roomId: number;
  userId: number | undefined;
  isConnected: boolean;
  toggleBlock: boolean;
  code: string;
}) => {
  const { userStatuses } = useWaitingStore();
  const [isReady, setIsReady] = useState<boolean>(false);
  const { Modal, isOpen, openModal, closeModal } = useModal();
  const [isCopied, setIsCopied] = useState<boolean>(false);

  useEffect(() => {
    setIsReady(
      userStatuses.find((user: UserStatus) => user.userId === userId)
        ?.isReady || false,
    );
  }, [userStatuses]);

  const toggleReady = () => {
    if (!isConnected) return;
    stompClient.publish({
      destination: `/pub/rooms/${roomId}/ready`,
    });
  };

  useEffect(() => {
    if (!isOpen) setIsCopied(false);
  }, [isOpen]);

  return (
    <>
      <div className={styles.readyContainer}>
        <div className={styles.readyButtonWrapper}>
          <GradButton
            color="secondary"
            fullWidth
            rounded
            onClick={toggleReady}
            disabled={toggleBlock}
          >
            <span
              className={`${styles.buttonText} ${!isReady && styles.blinking}`}
            >
              {isReady ? '준비취소' : '준비하기'}
            </span>
          </GradButton>
        </div>
        <div className={styles.shareButtonWrapper}>
          <GradButton rounded onClick={openModal}>
            <Image
              src="/images/share.svg"
              alt="share"
              width={28}
              height={28}
              className={styles.shareButton}
            />
          </GradButton>
          <div className={`${styles.toolTip}`}>
            <span className={styles.toolTipText}>코드를 공유해<br/>친구를 초대해보세요!</span>
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <div className={styles.modalContent}>
          <div className={styles.titleContainer}>
            <Image
              src={'/images/DecoIcon.svg'}
              alt={'quiz'}
              width={90}
              height={90}
            />
            <div className={styles.titleWrapper}>퀴즈 방 코드</div>
          </div>
          <div className={styles.textContainer}>
            <div className={styles.inputWrapper}>
              <TextInputField
                value={code}
                placeholder="코드 생성 오류"
                disabled
                borderRadius={12}
                endAdornment={
                  <button
                    onClick={() => {
                      setIsCopied(false);
                      navigator.clipboard.writeText(code);
                      setIsCopied(true);
                    }}
                    className={styles.copyButton}
                  >
                    복사하기 {isCopied ? '✅' : '\u00A0\u00A0\u00A0'}
                  </button>
                }
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ReadyButton;
