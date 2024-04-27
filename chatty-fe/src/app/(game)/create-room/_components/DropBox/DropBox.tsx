import React, { useState } from 'react';
import * as styles from './DropBox.css';
import Image from 'next/image';

const List = [
  { id: 1, name: 'asd' },
  { id: 2, name: 'asd' },
  { id: 3, name: 'asd' },
  { id: 4, name: 'asd' },
  { id: 5, name: 'asd' },
  { id: 6, name: 'asd' },
  { id: 7, name: 'asd' },
  { id: 8, name: 'asd' },
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
