'use client';
import { useRouter } from 'next/navigation';
import * as styles from './layout.css';
import Image from 'next/image';
import ProgressBar from './_component/ProgressBar';
import { Transition } from 'react-transition-group';
import { useEffect, useState } from 'react';

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
	const duration = 200;
	const defaultStyle = {
		transition: `opacity ${duration}ms ease-in-out`,
		opacity: 0,
	};
	const transitionStyles = {
		entering: { opacity: 1 },
		entered: { opacity: 1 },
		exiting: { opacity: 0 },
		exited: { opacity: 0 },
		unmounted: { opacity: 0 },
	};
	const [inProp, setInprop] = useState(false);

	useEffect(() => {
		setInprop(true);
	}, []);

	return (
		<Transition timeout={duration} in={inProp}>
			{(state) => (
				<div
					style={{
						...defaultStyle,
						...transitionStyles[state],
					}}
				>
					<div className={styles.container}>
						<div className={styles.headerWrapper}>
							<div
								className={styles.backBtnWrapper}
								onClick={handleBackBtnClick}
							>
								<Image
									src='/images/back.svg'
									alt='back'
									width={52}
									height={52}
								/>
							</div>
							<h1 className={styles.title}>{title}</h1>
							<div className={styles.backBtnWrapper} />
						</div>
						<ProgressBar progress={progress} />
						{children}
					</div>
				</div>
			)}
		</Transition>
	);
}
