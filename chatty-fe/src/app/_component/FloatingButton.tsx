'use client';
import React from 'react';
import * as styles from './styles/floatingButton.css';
import { useRouter } from 'next/navigation';

export default function FloatingButton() {
	const navigate = useRouter();
	const handleOnClick = () => {
		navigate.push('/select-subject');
	};
	return (
		<>
			<button className={styles.button} onClick={handleOnClick}>
				지금 무료로 시작하기
			</button>
		</>
	);
}
