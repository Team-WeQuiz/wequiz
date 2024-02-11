'use client';
import React, { useRef } from 'react';
import * as styles from './styles/uploadButton.css';

type UploadButtonProps = {
	onFileSelected: (file: File) => void;
};

export default function UploadButton({ onFileSelected }: UploadButtonProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			onFileSelected(e.target.files[0]);
		}
	};

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		fileInputRef.current?.click();
	};
	return (
		<>
			<input
				type='file'
				ref={fileInputRef}
				onChange={handleFileSelect}
				style={{ display: 'none' }}
			/>
			<button className={styles.button} onClick={handleClick}>
				파일 선택
			</button>
		</>
	);
}
