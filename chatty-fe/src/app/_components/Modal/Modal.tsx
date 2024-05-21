'use client';

import React, { useState, useEffect } from 'react';
import ReactDom from 'react-dom';
import * as styles from './Modal.css';
import Image from 'next/image';

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  timerSec?: number;
  closeButton?: boolean;
  closeBlocked?: boolean;
};

const Modal = ({
  isOpen,
  onClose,
  children,
  timerSec,
  closeButton = true,
  closeBlocked = false,
}: ModalProps) => {
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);
  const [timer, setTimer] = useState<number>(timerSec || -1);

  useEffect(() => {
    setModalRoot(document.getElementById('modal-root'));
  }, []);

  useEffect(() => {
    if (isOpen && timerSec && timer > 0) {
      const intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [isOpen, timerSec, timer]);

  const handleClose = () => {
    closeBlocked || timer > 0 ? () => {} : onClose();
  };

  useEffect(() => {
    if (modalRoot) {
      if (isOpen) {
        modalRoot.classList.add('visible');
      } else {
        modalRoot.classList.remove('visible');
      }
    }
  }, [isOpen, modalRoot]);

  useEffect(() => {
    setTimer(timerSec || -1);
  }, [isOpen]);

  if (!modalRoot) return null;

  return ReactDom.createPortal(
    isOpen ? (
      <div className={styles.modalBackdrop} onClick={handleClose}>
        <div
          className={styles.modalContainer}
          onClick={(e) => e.stopPropagation()}
        >
          {closeButton && (
            <div className={styles.closeButtonWrapper}>
              {timerSec ? (
                <button className={styles.closeButton} onClick={handleClose}>
                  <span>{timer}</span>
                </button>
              ) : (
                <button
                  onClick={handleClose}
                  className={styles.closeIconButton}
                >
                  <Image
                    src={'/images/CloseButton.svg'}
                    alt="close"
                    width={36}
                    height={36}
                  />
                </button>
              )}
            </div>
          )}
          {children}
        </div>
      </div>
    ) : null,
    modalRoot,
  );
};

export default Modal;
