import React from 'react';
import * as styles from './styles/uploadButton.css';

type UploadButtonProps = {
	onClick: () => void;
};

export default function UploadButton({ onClick }: UploadButtonProps) {
	return (
		<button className={styles.button} onClick={onClick}>
			파일 선택
		</button>
	);
}
