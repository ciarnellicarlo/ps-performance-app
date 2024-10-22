'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // This is the only import that changed
import styles from '../styles/Header.module.scss';

type HeaderProps = {
  variant: 'home' | 'game';
  title?: string; // Game title for game variant
}

const Header: React.FC<HeaderProps> = ({ variant, title }) => {
  const router = useRouter();

  // Rest of the component remains exactly the same
  if (variant === 'game') {
    return (
      <header className={styles.header}>
        <div className={styles.container}>
          <button 
            onClick={() => router.back()} 
            className={styles.iconButton}
            aria-label="Go back"
          >
            <Image
              src="/Back.svg"
              alt="Back"
              width={24}
              height={24}
            />
          </button>

          <h1 className={styles.gameTitle}>{title}</h1>

          <button 
            onClick={() => {/* Share functionality will be added later */}} 
            className={styles.iconButton}
            aria-label="Share"
          >
            <Image
              src="/Share.svg"
              alt="Share"
              width={24}
              height={24}
            />
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.userInfo}>
          <div className={styles.avatarContainer}>
            <Image
              src="/User.svg"
              alt="User Avatar"
              width={24}
              height={24}
              className={styles.avatarIcon}
            />
          </div>
          <div className={styles.welcomeText}>
            <p>Welcome</p>
            <p>User</p>
          </div>
        </div>
        <button className={styles.iconButton} aria-label="Menu">
          <Image
            src="/Menu.svg"
            alt="Menu"
            width={24}
            height={24}
          />
        </button>
      </div>
    </header>
  );
};

export default Header;