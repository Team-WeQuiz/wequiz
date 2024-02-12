'use client';
import React, { useState } from 'react';
import axios from 'axios';
import Layout from '../_layout';
import Button from '../_component/Button';
import * as styles from './uploadFile.css';
import Image from 'next/image';
import UploadButton from './_component/UploadButton';

export default function UploadFile() {
  const [isUploaded, setIsUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileUrl, setFileUrl] = useState('');

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    setIsUploading(true);

    try {
      const response = await axios.post('/api/s3-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total || 0;
          const progress = Math.round((progressEvent.loaded * 100) / total);
          setUploadProgress(progress);
        },
      });

      if (response.status === 200) {
        setIsUploaded(true);
        setIsUploading(false);
        setUploadProgress(0);
        setFileUrl(response.data.preUrl);
      } else {
        console.error('Upload failed:', response.data.error);
      }
    } catch (error) {
      console.error('Error occurred during the upload:', error);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const postUrl = async (url: string) => {
    try {
      const response = await axios.post('/api/upload', {
        url: url, // 파일 URL 전달
      });
      console.log('URL upload response:', response);
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
            handleUpload(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
          }
        }}
      >
        {isUploading ? (
          <div>업로드 중입니다...</div>
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
                <UploadButton onFileSelected={(file) => handleUpload(file)} />
              </div>
              {uploadProgress > 0 && <div>{uploadProgress}%</div>}
            </div>
          </>
        )}
      </div>
      <Button
        message="이제 거의 다 끝났어요!"
        step={3}
        isSelected={isUploaded}
        buttonClick={() => postUrl(fileUrl)}
      />
    </Layout>
  );
}
