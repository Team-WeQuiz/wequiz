import React, { useState } from 'react';
import * as styles from './DropBox.css';
import Image from 'next/image';

const List = [
  { id: 1, name: '1번 문제 리스트' },
  { id: 2, name: '2번 문제 리스트' },
  { id: 3, name: '3번 문제 리스트' },
  { id: 4, name: '4번 문제 리스트' },
  { id: 5, name: '5번 문제 리스트' },
  { id: 6, name: '6번 문제 리스트' },
  { id: 7, name: '7번 문제 리스트' },
  { id: 8, name: '8번 문제 리스트' },
];

export default function DropBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('');

  return (
    <div className={styles.MainContainer}>
      <div className={styles.Container} onClick={() => setIsOpen(!isOpen)}>
        <span className={selected === '' ? styles.NoneSelected : ''}>
          {selected || '문제를 선택해주세요.'}
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
            onClick={() => setSelected(item.name)}
            className={styles.ListItem}
            key={item.id}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
