'use client';
import React, { useState } from 'react';
import Layout from '../_layout';
import Button from '../_component/Button';
import * as styles from './uploadFile.css';
import Image from 'next/image';
import UploadButton from './_component/UploadButton';
import { handleUpload } from '@/app/_lib/uploader';
import axios from 'axios';

export default function UploadFile() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [fileNumber, setFileNumber] = useState(0);
  const [uploadedFileNumber, setUploadedFileNumber] = useState(1);
  const [urls, setUrls] = useState<string[]>([]);

  const onFileUpload = async (files: FileList) => {
    await handleUpload(
      files,
      setUploadProgress,
      setFileNumber,
      setUploadedFileNumber,
      setIsUploading,
      setIsUploaded,
      setUrls,
    );
  };
  const postUrl = async (urls: string[]) => {
    try {
      const response = await axios.post('/api/upload', {
        urls: urls,
      });
      console.log('URL upload response: ', response);
    } catch (error) {
      console.error('Error during URL upload:', error);
    }
  };
  return (
    <Layout title="공부하고 있는 파일을 업로드 해주세요" progress={3}>
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
                <Image
                  src="/images/upload.svg"
                  height={48}
                  width={48}
                  alt="upload"
                />
                Drag & Drop or
                <UploadButton
                  onFileSelected={(files: FileList) => onFileUpload(files)}
                />
              </div>
            </div>
          </>
        )}
      </div>
      <Button
        message="이제 거의 다 끝났어요!"
        step={3}
        isSelected={isUploaded}
        buttonClick={() => postUrl(urls)}
      />
    </Layout>
  );
}
