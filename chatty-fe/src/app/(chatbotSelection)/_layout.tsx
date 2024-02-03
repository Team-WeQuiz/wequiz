'use client';
import { useRouter } from 'next/navigation';
import * as styles from './layout.css';
import Image from 'next/image';
import ProgressBar from './_component/ProgressBar';

type SelectionLayoutProps = {
	children: React.ReactNode;
	title: string;
	progress: number;
};

export default function SelectionLayout({
	children,
	title,
	progress,
}: SelectionLayoutProps) {
	const navigate = useRouter();
	const handleBackBtnClick = () => {
		navigate.back();
	};

	return (
		<div className={styles.container}>
			<div className={styles.headerWrapper}>
				<div className={styles.backBtnWrapper} onClick={handleBackBtnClick}>
					<Image src='/images/back.svg' alt='back' width={52} height={52} />
				</div>
				<h1 className={styles.title}>{title}</h1>
				<div className={styles.backBtnWrapper} />
			</div>
			<ProgressBar progress={progress} />
			{children}
		</div>
	);
}
