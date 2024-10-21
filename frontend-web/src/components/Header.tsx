import React from 'react';
import Image from 'next/image';
import styles from '../styles/Header.module.scss';

const Header: React.FC = () => {
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
          <Image
            src="/Menu.svg"
            alt="Menu"
            width={24}
            height={24}
            className={styles.menuIcon}
          />
      </div>
    </header>
  );
};

export default Header;