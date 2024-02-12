'use client';
import * as styles from './styles/main.css';
import Header from '@/app/_component/Header';
import FloatingButton from './_component/FloatingButton';
import Footer from '@/app/_component/Footer';

export default function Main() {
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.banner} />
      <div className={styles.chattySection} />

      <FloatingButton />
      <Footer />
    </div>
  );
}
