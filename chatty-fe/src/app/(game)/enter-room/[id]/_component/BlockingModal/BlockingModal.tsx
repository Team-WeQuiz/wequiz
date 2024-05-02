import Modal from '@/app/_components/Modal/Modal';
import * as styles from './BlockingModal.css';
import Image from 'next/image';

const BlockingModal = ({
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
        <div className={styles.textContainer}>
          <Image
            src={'/images/Cancel_fill.svg'}
            alt={'cancel'}
            width={32}
            height={32}
          />
          <span>방이 다 챴습니다!</span>
          <Image
            src={'/images/Cancel_fill.svg'}
            alt={'cancel'}
            width={32}
            height={32}
          />
        </div>
      </div>
    </Modal>
  );
};

export default BlockingModal;
