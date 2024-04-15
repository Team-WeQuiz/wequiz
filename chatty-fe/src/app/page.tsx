import Image from 'next/image';
import * as styles from './page.css';
import Sparkles from './_components/Sparkles/Sparkles';
import GradButton from './_components/GradButton';
import Link from 'next/link';

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.centerContainer}>
        <div className={styles.glow}></div>
        <div className={styles.mask}>
          <Sparkles />
          <div className={styles.logoWapper}>
            <Image
              src={'/images/logo_main.png'}
              alt={'wequiz_main_logo'}
              layout="fill"
              objectFit="contain"
            />
          </div>
          <div className={styles.buttonWrapper}>
            <Link href="/main-lobby">
              <GradButton rounded fullWidth>
                <div className={styles.buttonText}>시작!</div>
              </GradButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
