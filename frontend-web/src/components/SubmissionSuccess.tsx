'use client';

import Image from 'next/image';
import styles from '../styles/SubmissionSuccess.module.scss';

interface SubmissionSuccessProps {
    title: string;
    onBackToHome: () => void;
    isLoading?: boolean;
  }

  export const SubmissionSuccess = ({ 
    title, 
    onBackToHome,
    isLoading 
  }: SubmissionSuccessProps) => (
    <div className={styles.container}>
  <div className={styles.contentSection}>
    <h1 className={styles.heading}>Submission Sent!</h1>
    <p className={styles.subheading}>Thanks for your contribution!</p>
  </div>
  
  <div className={styles.checkmarkContainer}>
    <Image
      src="/GreenCheckmark.svg"
      alt="Success"
      width={164}
      height={164}
      priority
    />
  </div>

  <button 
      className={styles.backButton}
      onClick={onBackToHome}
      disabled={isLoading}
    >
      {isLoading ? 'Updating...' : 'Back To Homepage'}
    </button>
</div>
  );
;