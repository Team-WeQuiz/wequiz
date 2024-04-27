'use client';
import React, { useState } from 'react';
import * as styles from './page.css';
import ContentsBox from './_components/ContentsBox';
import TextInputField from '@/app/_components/TextInputField';
import FileUploadBox from './_components/FileUploadBox';
import RadioInputField from '@/app/_components/RadioInputField';
import { postRoom } from '@/app/_api/createRoom';
import { useRouter } from 'next/navigation';
import GradButton from '@/app/_components/GradButton';
import QuestionMaker from './_components/QuestionMaker/QuestionMaker';
import DropBox from './_components/DropBox/DropBox';

export default function CreateRoom() {
  const problemTypeOptions = [
    { id: '객관식', value: '객관식', label: '객관식' },
    { id: '객관식', value: '주관식', label: '주관식' },
    { id: '객관식', value: '단답형', label: '단답형' },
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [numberOfParticipants, setNumberOfParticipants] = useState(0);
  const [password, setPassword] = useState('');
  const [time, setTime] = useState(0);
  const [problemType, setProblemType] = useState('객관식');
  const [numberOfProblems, setNumberOfProblems] = useState(0);
  const [qustionType, setQuestionType] = useState<'list' | 'create'>('list');

  const router = useRouter();

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await postRoom(
        title,
        numberOfProblems,
        time,
        numberOfParticipants,
        password,
        problemType,
        files,
        description,
      );
      console.log(response);
      if (response) {
        router.push(`waiting-room/${response.roomId}`);
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.container}>
        <h1 className={styles.title}>방 만들기</h1>
        <div className={styles.contentsContainer}>
          <h1 className={styles.ContainerTitle}>설정</h1>
          {/* 방 제목 */}
          <div className={styles.contentsWrapper}>
            <ContentsBox imgSrc="/images/Home.svg" title="방 제목" />
            <div className={styles.titleWrapper}>
              <TextInputField
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                borderRadius={12}
              />
            </div>
          </div>

          {/* 설명 */}
          <div className={styles.contentsWrapper}>
            <ContentsBox imgSrc="/images/comment.svg" title="설명" />
            <div className={styles.defaultWrapper}>
              <TextInputField
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                borderRadius={12}
              />
            </div>
          </div>

          {/* 인원 수 */}
          <div className={styles.contentsWrapper}>
            <ContentsBox imgSrc="/images/Group_add.svg" title="인원 수" />
            <div className={styles.defaultWrapper}>
              <TextInputField
                type="number"
                value={String(numberOfParticipants)}
                onChange={(e) =>
                  setNumberOfParticipants(Number(e.target.value))
                }
                borderRadius={12}
              />
            </div>
          </div>

          {/* 비밀번호 */}
          <div className={styles.contentsWrapper}>
            <ContentsBox imgSrc="/images/Key.svg" title="비밀번호" />
            <div className={styles.defaultWrapper}>
              <TextInputField
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                borderRadius={12}
              />
            </div>
          </div>

          {/* 문제 수 */}
          <div className={styles.contentsWrapper}>
            <ContentsBox imgSrc="/images/Book_open_alt.svg" title="문제 수" />
            <div className={styles.defaultWrapper}>
              <TextInputField
                type="number"
                value={String(numberOfProblems)}
                onChange={(e) => setNumberOfProblems(Number(e.target.value))}
                borderRadius={12}
              />
            </div>
          </div>
        </div>
        <div className={styles.contentsContainer}>
          {/* 파일 업로드*/}
          <h1 className={styles.ContainerTitle}>문제 만들기</h1>

          <QuestionMaker
            questionType={qustionType}
            setQuestionType={setQuestionType}
          />
          {qustionType === 'create' ? (
            <FileUploadBox setFiles={setFiles} />
          ) : (
            <DropBox />
          )}
        </div>
        <div className={styles.buttonContainer}>
          <div className={styles.buttonWrapper}>
            <GradButton
              rounded
              onClick={onSubmit}
              fullWidth
              isLoading={isLoading}
              disabled={isLoading}
            >
              생성하기
            </GradButton>
          </div>
        </div>
      </div>
    </div>
  );
}
