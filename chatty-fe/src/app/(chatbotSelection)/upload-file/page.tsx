'use client';
import React, { useState } from 'react';
import Layout from '../_layout';
import Button from '../_component/Button';
import * as styles from './uploadFile.css';
import Image from 'next/image';
import UploadButton from './_component/UploadButton';

export default function UploadFile() {
	const [isUploaded, setIsUploaded] = useState(false);
	const handleUpload = () => {
		setIsUploaded(true);
	};
	return (
		<Layout title='공부하고 있는 파일을 업로드 해주세요' progress={3}>
			<div className={styles.container({ isUploaded: isUploaded })}>
				{isUploaded ? (
					'업로드 완료!'
				) : (
					<div className={styles.wrapper}>
						<div className={styles.ddWrapper}>
							<Image
								src='/images/upload.svg'
								height={48}
								width={48}
								alt='upload'
							/>
							Drag & Drop
						</div>
						<UploadButton onClick={() => handleUpload()} />
					</div>
				)}
			</div>
			<Button
				message='이제 거의 다 끝났어요!'
				step={3}
				isSelected={isUploaded}
			/>
		</Layout>
	);
}
