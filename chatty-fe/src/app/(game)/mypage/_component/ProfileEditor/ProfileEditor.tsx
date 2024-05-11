'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import * as styles from './ProfileEditor.css';
import useModal from '@/app/_hooks/useModal';
import Modal from '@/app/_components/Modal/Modal';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import SolidButton from '@/app/_components/SolidButton';
import { getUserInfo, uploadProfile } from '@/app/_api/auth';
import useAuthStore from '@/app/_store/useAuthStore';
import { revalidatePath } from 'next/cache';
import useUserInfoStore from '@/app/_store/useUserInfoStore';

const ProfileEditor = ({ profile }: { profile: string }) => {
  const { isOpen, openModal, closeModal } = useModal();
  const imageRef = useRef<HTMLImageElement>(null);
  const [selectedFile, setSelectedFile] = useState<File[] | null>(null);
  const [cropper, setCropper] = useState<Cropper | null>(null);
  const [croppedImageFile, setCroppedImageFile] = useState<File[] | null>(null);
  const { accessToken } = useAuthStore();
  const { setUserInfo } = useUserInfoStore();

  useEffect(() => {}, [profile]);

  const handleEditButtonClick = () => {
    document.getElementById('profileImageInput')?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (e.target.files && e.target.files?.length && e.target.files[0]) {
      const reader = new FileReader();
      setSelectedFile([e.target.files[0]]);
      openModal();
      reader.onload = () => {
        const imageElement: any = imageRef.current;
        imageElement.src = reader.result;

        if (cropper) {
          cropper.destroy();
        }

        const newCropper = new Cropper(imageElement, {
          aspectRatio: 1,
          viewMode: 1,
          dragMode: 'move',
          autoCropArea: 1,
          cropBoxResizable: false,
          cropBoxMovable: false,
          modal: true,
        });

        setCropper(newCropper);
      };
      if (file) reader.readAsDataURL(file);
    }
  };

  const handleCropCancel = () => {
    setSelectedFile(null);
    closeModal();
  };

  const handleCropConfirm = () => {
    if (cropper && selectedFile) {
      // Get the cropped data as a Blob
      cropper
        .getCroppedCanvas({ width: 128, height: 128 })
        .toBlob(async (blob: Blob | null) => {
          if (blob) {
            // Create a FormData object and append the original file
            const image = selectedFile;
            if (image) {
              const newImage = new File([blob], image[0].name, {
                type: `image/${image[0].type.split('/')[1]}`,
              });

              setCroppedImageFile([newImage]);

              const reader = new FileReader();

              reader.readAsDataURL(newImage);
              try {
                uploadProfile(newImage, accessToken);
                const response = await getUserInfo(accessToken);
                setUserInfo(response);
              } catch (error) {
                console.error('error: ', error);
              }
            }
            setSelectedFile(null);
            closeModal();
          }
        });
    }
  };

  return (
    <div className={styles.profileWrapper}>
      <Image
        src={
          profile && profile !== 'bit.ly/wequiz_profile_image'
            ? profile
            : '/images/Empty_profile.svg'
        }
        alt="user_profile"
        width={120}
        height={120}
        className={styles.profileImage}
      />
      <button className={styles.editButton} onClick={handleEditButtonClick}>
        <Image
          src="/images/edit_photo.svg"
          alt="camera_icon"
          width={28}
          height={28}
        />
      </button>
      <input
        type="file"
        accept="image/jpg, image/jpeg, image/png"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
        id="profileImageInput"
      />
      <Modal isOpen={isOpen} onClose={handleCropCancel}>
        <div className={styles.cropperModalContainer}>
          <h2 className={styles.cropperModalTitle}>프로필 사진 편집</h2>

          <div className={styles.cropperWrapper}>
            <img ref={imageRef} alt="Preview" className={styles.cropperImage} />
          </div>
          <div className={styles.buttonGroup}>
            <SolidButton onClick={handleCropCancel} fullWidth>
              <span className={styles.buttonText}>취소</span>
            </SolidButton>
            <SolidButton onClick={handleCropConfirm} fullWidth>
              <span className={styles.buttonText}>확인</span>
            </SolidButton>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileEditor;
