'use client';

import { useState } from 'react';
import Modal from '@/app/_components/Modal/Modal';
import * as styles from './NicknameModal.css';
import Image from 'next/image';
import TextInputField from '@/app/_components/TextInputField';
import GradButton from '@/app/_components/GradButton';
import { useRouter } from 'next/navigation';

const NicknameModal = ({
  name,
  roomId,
  isOpen,
  closeModal,
  goingBack,
}: {
  name: string | undefined;
  roomId: number;
  isOpen: boolean;
  closeModal: () => void;
  goingBack: () => void;
}) => {
  const [nickname, setNickname] = useState('');
  const router = useRouter();

  const handleNext = () => {
    router.push(`/waiting-room/${roomId}?nickname=${nickname}`);
    closeModal();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleNext();
  };

  const handleClose = () => {
    closeModal();
    goingBack();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <div className={styles.modalContent}>
          <div className={styles.titleContainer}>
            <Image
              src={'/images/DecoIcon.svg'}
              alt={'quiz'}
              width={90}
              height={90}
            />
            <div className={styles.titleWrapper}>{name}</div>
          </div>
          <div className={styles.inputContainer}>
            <Image
              src={'/images/User.svg'}
              alt={'user'}
              width={24}
              height={24}
            />
            <div className={styles.inputWrapper}>
              <TextInputField
                value={nickname}
                placeholder={'닉네임을 설정해 주세요.'}
                onChange={(e) => {
                  setNickname(e.target.value);
                }}
                borderRadius={12}
              />
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <GradButton
              type="submit"
              color="primary"
              fullWidth
              rounded
              disabled={!nickname}
            >
              <span className={styles.buttonText}>다음</span>
            </GradButton>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default NicknameModal;
