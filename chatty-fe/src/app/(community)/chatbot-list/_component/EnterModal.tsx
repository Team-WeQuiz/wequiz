import Modal from '@/app/_component/Modal';
import * as styles from './style/enterModal.css';
import { FormEvent } from 'react';

const EnterModal = ({
  id,
  isOpen,
  onClose,
}: {
  id: number;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const enterSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log('submit');
    console.log(id);
    onClose();
  };

  return (
    <>
      <Modal
        title="방 입장하기"
        isOpen={isOpen}
        onClose={onClose}
        confirmButton={{
          text: '입장',
          type: 'submit',
          form: 'entering-form',
        }}
      >
        <div className={styles.formContainer}>
          <form
            onSubmit={enterSubmit}
            id="entering-form"
            className={styles.form}
          >
            <h4>방제 {id}</h4>
            <div>
              <label htmlFor="password">PW</label>
              <input type="new-password" id="password" />
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default EnterModal;
