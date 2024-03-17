'use client';
import React, { useState } from 'react';
import * as styles from './FileUploadBox.css';
import { handleUpload } from '@/app/_lib/uploader';
import Image from 'next/image';

type FileUploadBoxProps = {
  setFileNames: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function FileUploadBox({ setFileNames }: FileUploadBoxProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [fileNumber, setFileNumber] = useState(0);
  const [uploadedFileNumber, setUploadedFileNumber] = useState(1);

  const onFileUpload = async (files: FileList) => {
    await handleUpload(
      files,
      setUploadProgress,
      setFileNumber,
      setUploadedFileNumber,
      setIsUploading,
      setIsUploaded,
      setFileNames,
    );
  };
  return (
    <div
      className={styles.container({
        isUploaded: isUploaded,
        isUploading: isUploading,
      })}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          onFileUpload(e.dataTransfer.files);
          e.dataTransfer.clearData();
        }
      }}
    >
      {isUploading ? (
        <>
          <div>업로드 중입니다...</div>
          <div>
            {uploadedFileNumber} / {fileNumber}
          </div>
          <div>{uploadProgress}%</div>
        </>
      ) : isUploaded ? (
        <div>업로드 완료!</div>
      ) : (
        <>
          <div className={styles.wrapper}>
            <div className={styles.ddWrapper}>
              <p className={styles.title}>문제지를 업로드 하세요</p>
              <Image
                src="/images/Foled_up_fill.svg"
                height={24}
                width={24}
                alt="upload"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
