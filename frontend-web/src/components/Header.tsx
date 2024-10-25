// components/Header/Header.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../styles/Header.module.scss';

type HeaderProps = {
 variant: 'home' | 'game';
 title?: string;
}

const Header: React.FC<HeaderProps> = ({ variant, title }) => {
 const router = useRouter();

 if (variant === 'game') {
   return (
     <header className={styles.header}>
       <div className={styles.container}>
         <button 
           onClick={() => router.back()} 
           className={styles.iconButton}
           aria-label="Go back"
         >
           <Image src="/Back.svg" alt="Back" width={24} height={24} />
         </button>
         <h1 className={styles.gameTitle}>{title}</h1>
         <button 
           onClick={() => {}} 
           className={styles.iconButton}
           aria-label="Share"
         >
           <Image src="/Share.svg" alt="Share" width={24} height={24} />
         </button>
       </div>
     </header>
   );
 }

 return (
   <header className={styles.header}>
     <div className={styles.container}>
       <div className={styles.menuSection}>
         <button className={`${styles.iconButton} ${styles.mobileOnly}`} aria-label="Menu">
           <Image src="/Menu.svg" alt="Menu" width={24} height={24} />
         </button>
         <nav className={styles.desktopNav}>
           <Link href="/" className={styles.navLink}>Home</Link>
           <Link href="/about" className={styles.navLink}>About Us</Link>
           <Link href="/donate" className={styles.navLink}>Donate? 🥺</Link>
         </nav>
       </div>
       <div className={styles.userInfo}>
         <div className={styles.welcomeText}>
           <p>Welcome</p>
           <p>User</p>
         </div>
         <div className={styles.avatarContainer}>
           <Image src="/User.svg" alt="User Avatar" width={24} height={24} className={styles.avatarIcon} />
         </div>
       </div>
     </div>
   </header>
 );
};

export default Header;