'use client';
import React, { useState } from 'react';
import * as styles from './FileUploadBox.css';
//import { handleUpload } from '@/app/_lib/uploader';
import Image from 'next/image';

type FileUploadBoxProps = {
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
};

export default function FileUploadBox({ setFiles }: FileUploadBoxProps) {
  //const [uploadProgress, setUploadProgress] = useState(0);
  //const [isUploading, setIsUploading] = useState(false);
  //const [fileNumber, setFileNumber] = useState(0);
  //const [uploadedFileNumber, setUploadedFileNumber] = useState(1);
  const [isUploaded, setIsUploaded] = useState(false);
  const [uploadedFileNames, setFileNames] = useState<string[]>([]);

  // const onFileUpload = async (files: FileList) => {
  //   await handleUpload(
  //     files,
  //     setUploadProgress,
  //     setFileNumber,
  //     setUploadedFileNumber,
  //     setIsUploading,
  //     setIsUploaded,
  //     setFileNames,
  //   );
  // };

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files) {
  //     setFiles(Array.from(e.target.files));
  //   }
  // };

  return (
    <div
      className={styles.container({
        isUploaded: isUploaded,
      })}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          setFiles(Array.from(e.dataTransfer.files));
        }
        setFileNames(Array.from(e.dataTransfer.files).map((file) => file.name));
        setIsUploaded(true);
      }}
    >
      {isUploaded ? (
        <div className={styles.uploadedFiles}>
          <div>업로드 완료!</div>
          {uploadedFileNames.map((name) => (
            <div key={name}>{name}</div>
          ))}
        </div>
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
