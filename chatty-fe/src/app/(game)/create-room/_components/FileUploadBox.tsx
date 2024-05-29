'use client';
import React, { useEffect, useState } from 'react';
import * as styles from './FileUploadBox.css';
import Image from 'next/image';

type FileUploadBoxProps = {
  setFiles: React.Dispatch<React.SetStateAction<File[] | null>>;
};

const MAX_FILE_SIZE_MB = 25;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export default function FileUploadBox({ setFiles }: FileUploadBoxProps) {
  const [isUploaded, setIsUploaded] = useState(false);
  const [uploadedFileNames, setFileNames] = useState<string[]>([]);
  const [files, setLocalFiles] = useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const deleteFile = (fileName: string) => {
    const newFileNames = uploadedFileNames.filter((name) => name !== fileName);
    const newFiles = files.filter((file) => file.name !== fileName);
    setFileNames(newFileNames);
    setLocalFiles(newFiles);
  };

  const checkDuplicate = (fileNames: string[]) => {
    return fileNames.some((name, index) => fileNames.indexOf(name) !== index);
  };

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files as FileList);
    const newFileNames = newFiles.map((file) => file.name);
    if (checkDuplicate(newFileNames)) {
      alert('중복된 파일 이름이 있습니다.');
      return;
    }
    // 파일크기 25MB, 페이지수 100개 제한
    for (const file of newFiles) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        alert('파일 크기가 25MB를 초과했습니다.');
        return;
      }
    }

    setFiles(newFiles);
    setLocalFiles(newFiles);
    setFileNames(newFileNames);
    setIsUploaded(true);
  };

  useEffect(() => {
    setFiles(files);
  }, [files, setFiles]);

  useEffect(() => {
    if (uploadedFileNames.length !== 0) {
      setIsUploaded(true);
    } else {
      setIsUploaded(false);
    }
    console.log(uploadedFileNames);
  }, [uploadedFileNames]);

  return (
    <div
      className={styles.container({
        isUploaded: isUploaded,
      })}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const newFiles = Array.from(e.dataTransfer.files);
        const pdfFiles = newFiles.filter(
          (file) => file.type === 'application/pdf',
        );
        if (pdfFiles.length !== newFiles.length) {
          alert('PDF 파일만 업로드할 수 있습니다.');
          return;
        }
        for (const file of newFiles) {
          if (file.size > MAX_FILE_SIZE_BYTES) {
            alert('파일 크기가 25MB를 초과했습니다.');
            return;
          }
        }
        const newFileNames = newFiles.map((file) => file.name);
        if (checkDuplicate(newFileNames)) {
          alert('중복된 파일 이름이 있습니다.');
          return;
        }
        setFiles(newFiles);
        setLocalFiles(newFiles);
        setFileNames(newFiles.map((file) => file.name));
        setIsUploaded(true);
      }}
    >
      {isUploaded ? (
        <>
          <div style={{ fontSize: '20px', marginBottom: '10px' }}>
            업로드 완료!
          </div>
          <div className={styles.FileListContainer}>
            {uploadedFileNames.map((name) => (
              <div className={styles.FileListWrapper} key={name}>
                <span className={styles.FileName}>{name}</span>
                <button
                  className={styles.FileDeleteButton}
                  onClick={() => deleteFile(name)}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className={styles.wrapper}>
            <div className={styles.ddWrapper} onClick={handleFileInputClick}>
              <p className={styles.title}>
                문제를 생성할 <b>pdf파일</b>을 업로드 해주세요
                <br />
              </p>
              <span className={styles.comment}>
                (최대 파일 크기: 25MB, 최대 페이지 수: 100)
              </span>
              <Image
                src="/images/Foled_up_fill.svg"
                height={24}
                width={24}
                alt="upload"
              />
            </div>
          </div>
          <input
            type="file"
            accept="application/pdf"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            className={styles.fileInput}
          />
        </>
      )}
    </div>
  );
}
