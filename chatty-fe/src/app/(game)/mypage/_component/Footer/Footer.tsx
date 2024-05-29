import * as styles from './Footer.css';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className={styles.mypageFooter}>
      <div className={styles.footerWrapper}>
        <Image
          src="/images/footer-logo.svg"
          alt="logo"
          width={200}
          height={100}
          className={styles.footerLogo}
        />
        <div className={styles.footerLinks}>
          <Link
            href="https://team-wequiz.github.io/wequiz/"
            target="_blank"
            className={styles.link}
          >
            <span className={styles.linkText}>About Us</span>
          </Link>
          <Link
            href="https://docs.google.com/forms/d/1GZ3mHS6XMvTsEqeMhKeAG75Ck24y7SUZdQ6sDTqrw2M"
            target="_blank"
            className={styles.link}
          >
            <span className={styles.linkText}>Send Feedback</span>
          </Link>
          <div>
            <span
              className={styles.linkText}
              style={{ textDecoration: 'none' }}
            >
              Contact Us
            </span>
            <div className={styles.linkIcons}>
              <Link
                href="https://github.com/Team-WeQuiz/wequiz"
                target="_blank"
              >
                <Image
                  src="/images/github-icon.svg"
                  alt="github"
                  width={24}
                  height={24}
                  className={styles.socialIcon}
                />
              </Link>
              <Link href="mailto:wequiz.contact@gmail.com" target="_blank">
                <Image
                  src="/images/google-icon.svg"
                  alt="mail"
                  width={24}
                  height={24}
                  className={styles.socialIcon}
                />
              </Link>
              <Link
                href="https://www.instagram.com/wequiz_official/"
                target="_blank"
              >
                <Image
                  src="/images/instagram-icon.svg"
                  alt="instagram"
                  width={24}
                  height={24}
                  className={styles.socialIcon}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <span className={styles.copyRight}>
        © Copyright 2024. WeQuiz All rights reserved.
      </span>
    </footer>
  );
};

export default Footer;
