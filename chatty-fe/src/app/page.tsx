'use client';
import * as styles from './main.css';
import Header from './_component/Header';
import FloatingButton from './_component/FloatingButton';
import { useState } from 'react';
import Card from './_component/Card';
import Footer from './_component/Footer';

export default function Home() {
	const [card, setCard] = useState([
		'card1',
		'card2',
		'card3',
		'card4',
		'card5',
		'card5',
		'card5',
		'card5',
		'card5',
		'card5',
	]);
	return (
		<div className={styles.container}>
			<Header />
			<div className={styles.banner} />
			<div className={styles.descriptionWrapper}>
				<h1>프로젝트에 대한 간단한 소개 멘트</h1>
				<p>프로젝트에 대한 간단한 소개 멘트</p>
				<p>프로젝트에 대한 간단한 소개 멘트</p>
			</div>
			<div className={styles.cardWrapper}>
				{card.map((card, i) => (
					<Card key={i} />
				))}
			</div>

			<FloatingButton />
			<Footer />
		</div>
	);
}
