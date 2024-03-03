'use client';

import React, { useState, useEffect } from 'react';
import ReactDom from 'react-dom';
import * as styles from './styles/modal.css';
import { Modal } from '../_types/modal';
import { AiOutlineClose } from 'react-icons/ai';
import CustomButton from './CustomButton';

/**
 * @description 공용 모달 컴포넌트 입니다.
 *
 * @param title - 모달 제목 (선택)
 * @param isOpen - 모달 오픈 여부 (필수)
 * @param onClose - 모달 닫기 함수 (필수)
 * @param children - 모달 내용 (필수)
 * @param confirmButton - 확인 버튼 (선택, 기본값: onClose를 실행하는 '확인' 버튼)
 *  - variant: 'contained' | 'outlined' | 'text'
 *  - text: 버튼 텍스트 (필수)
 *  - onClick: 버튼 클릭 시 실행 함수 (선택)
 *  - type: 'button' | 'submit' | 'reset' (선택)
 *  - form: 폼 아이디 (선택)
 *  - isLoading: 로딩 중 여부 전달 (선택)
 */

const Modal = ({ title, isOpen, onClose, children, confirmButton }: Modal) => {
  const [modalRoot, setModelRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setModelRoot(document.getElementById('modal-root'));
  }, []);

  useEffect(() => {
    if (modalRoot) {
      if (isOpen) {
        modalRoot.classList.add('visible');
      } else {
        modalRoot.classList.remove('visible');
      }
    }
  }, [isOpen, modalRoot]);

  if (!modalRoot) return null;
  return ReactDom.createPortal(
    isOpen ? (
      <div className={styles.modalBackdrop} onClick={onClose}>
        <div
          className={styles.modalContainer}
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
          }}
        >
          <div className={styles.modalHeader}>
            <div className={styles.empty}>&nbsp;</div>
            {title && <h3>{title}</h3>}
            <CustomButton onClick={onClose}>
              <AiOutlineClose size={25} />
            </CustomButton>
          </div>
          <div className={styles.modalContent}>{children}</div>
          <div className={styles.modalFooter}>
            {confirmButton ? (
              <CustomButton
                variant={confirmButton.variant || 'contained'}
                type={confirmButton.type}
                form={confirmButton.form}
                onClick={confirmButton.onClick}
                disabled={confirmButton.isLoading}
              >
                <span className={styles.confirmButtonText}>
                  {confirmButton.text}
                </span>
              </CustomButton>
            ) : (
              <CustomButton variant={'contained'} onClick={onClose}>
                <span className={styles.confirmButtonText}>확인</span>
              </CustomButton>
            )}
          </div>
        </div>
      </div>
    ) : null,
    modalRoot,
  );
};

export default Modal;
