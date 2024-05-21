import React, { useEffect, useState } from 'react';
import * as styles from './DropBox.css';
import Image from 'next/image';
type ExistQuiz = {
  quizDocId: string;
  description: string;
  numberOfQuiz: number;
};

type DropBoxProps = {
  List: ExistQuiz[];
  setNumberOfProblems: (numberOfProblems: number) => void;
  selectedList: string | null;
  setSelectedList: (selectedList: string | null) => void;
};
export default function DropBox({
  List,
  setNumberOfProblems,
  selectedList,
  setSelectedList,
}: DropBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [quizList, setQuizList] = useState<ExistQuiz[]>([]);
  useEffect(() => {
    setQuizList(List);
  }, []);
  useEffect(() => {
    console.log('quizList:', quizList);
  }, [quizList]);
  const handleSelected = (selected: string, numberOfProblems: number) => {
    setSelectedList(selected);
    setNumberOfProblems(numberOfProblems);
  };

  return (
    <div className={styles.MainContainer}>
      <div className={styles.Container} onClick={() => setIsOpen(!isOpen)}>
        <span className={selectedList === '' ? styles.NoneSelected : ''}>
          {selectedList || '문제를 선택해주세요.'}
        </span>
        <button className={styles.ButtonWrapper}>
          <Image
            src="/images/expand_more.svg"
            alt="upload"
            width={24}
            height={24}
          />
        </button>
      </div>
      <ul className={isOpen ? styles.List : styles.ListNone}>
        {List.map((item) => (
          <li
            onClick={() => handleSelected(item.quizDocId, item.numberOfQuiz)}
            className={styles.ListItem}
            key={item.quizDocId}
          >
            {item.quizDocId}
          </li>
        ))}
      </ul>
    </div>
  );
}
