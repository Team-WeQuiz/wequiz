'use client';
import React, { useState } from 'react';
import * as styles from './page.css';
import ContentsBox from './_components/ContentsBox';
import TextInputField from '@/app/_components/TextInputField';
import FileUploadBox from './_components/FileUploadBox';
import RadioInputField from '@/app/_components/RadioInputField';

export default function CreateRoom() {
  const problemTypeOptions = [
    { id: '객관식', value: '객관식', label: '객관식' },
    { id: '객관식', value: '주관식', label: '주관식' },
    { id: '객관식', value: '단답형', label: '단답형' },
  ];

  const [fileNames, setFileNames] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [numberOfParticipants, setNumberOfParticipants] = useState('');
  const [password, setPassword] = useState('');
  const [time, setTime] = useState('');
  const [problemType, setProblemType] = useState('객관식');
  const [numberOfProblems, setNumberOfProblems] = useState('');

  const handleRadioChange = (value: string) => {
    setProblemType(value);
  };

  // 테스트 코드
  const onSubmit = () => {
    console.log('File Names: ', fileNames);
    console.log('Title: ', title);
    console.log('Description: ', description);
    console.log('Number Of Participants: ', numberOfParticipants);
    console.log('Password: ', password);
    console.log('Time: ', time);
    console.log('Problem Type: ', problemType);
    console.log('Number Of Problems: ', numberOfProblems);
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.container}>
        <h1 className={styles.title}>방 만들기</h1>
        <div className={styles.contentsContainer}>
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
                value={numberOfParticipants}
                onChange={(e) => setNumberOfParticipants(e.target.value)}
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

          {/* 시간 */}
          <div className={styles.contentsWrapper}>
            <ContentsBox imgSrc="/images/Tumer_fill.svg" title="시간" />
            <div className={styles.defaultWrapper}>
              <TextInputField
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                borderRadius={12}
              />
            </div>
          </div>
        </div>
        <div className={styles.contentsContainer}>
          {/* 파일 업로드*/}
          <div className={styles.contentsWrapper}>
            <ContentsBox imgSrc="/images/paper_clip.svg" title="파일" />
            <div className={styles.titleWrapper}>
              <FileUploadBox setFileNames={setFileNames} />
            </div>
          </div>

          {/* 문제 유형 */}
          <div className={styles.contentsWrapper}>
            <ContentsBox imgSrc="/images/edit.svg" title="문제 유형" />
            <div className={styles.defaultWrapper}>
              <RadioInputField
                name="radioGroup"
                options={problemTypeOptions}
                selectedValue={problemType}
                onChange={handleRadioChange}
              />
            </div>
          </div>
          {/* 문제 수 */}
          <div className={styles.contentsWrapper}>
            <ContentsBox imgSrc="/images/Book_open_alt.svg" title="문제 수" />
            <div className={styles.defaultWrapper}>
              <TextInputField
                type="number"
                value={numberOfProblems}
                onChange={(e) => setNumberOfProblems(e.target.value)}
                borderRadius={12}
              />
            </div>
          </div>
        </div>
        <button onClick={onSubmit}>생성하기</button>
      </div>
    </div>
  );
}
