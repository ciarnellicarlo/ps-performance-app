'use client';

import Image from 'next/image';
import { ConsoleType, ConsolePerformance } from '@/types/game';
import styles from '../styles/ConsoleCard.module.scss';

interface ConsoleCardProps {
    consoleName: ConsoleType;
    performance: ConsolePerformance;
    onSubmitClick: () => void;
  }

const consoleImages: Record<ConsoleType, string> = {
  'PS4': '/PS4Base.svg',
  'PS4 Pro': '/PS4Pro.svg',
  'PS5': '/PS5Base.svg',
  'PS5 Pro': '/PS5Pro.svg'
};

export const ConsoleCard = ({ consoleName, performance, onSubmitClick }: ConsoleCardProps) => {
  const renderContent = () => {
    // Case 1: No data yet (hasGraphicsSettings is null)
    if (performance.hasGraphicsSettings === null) {
      return (
        <div className={styles.unavailable}>
          <p className={styles.message}>Not available yet</p>
          <button 
            className={styles.submitButton}
            type="button"
            onClick={() => {
              console.log('Submit button clicked for', consoleName);
              onSubmitClick();
            }}
          >
            Submit
          </button>
        </div>
      );
    }

    // Case 2: Has graphics settings (Fidelity & Performance modes)
    if (performance.hasGraphicsSettings) {
      return (
        <div className={styles.modes}>
          <div className={styles.mode}>
            <h4>Fidelity Mode</h4>
            <p>FPS: {performance.fidelityMode?.fps || 'N/A'}</p>
            <p>Resolution: {performance.fidelityMode?.resolution || 'N/A'}</p>
          </div>
          <div className={styles.mode}>
            <h4>Performance Mode</h4>
            <p>FPS: {performance.performanceMode?.fps || 'N/A'}</p>
            <p>Resolution: {performance.performanceMode?.resolution || 'N/A'}</p>
          </div>
        </div>
      );
    }

    // Case 3: Standard mode only
    return (
      <div className={styles.mode}>
        <h4>Standard Mode</h4>
        <p>FPS: {performance.standardMode?.fps || 'N/A'}</p>
        <p>Resolution: {performance.standardMode?.resolution || 'N/A'}</p>
      </div>
    );
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{consoleName}</h3>
      <div className={styles.imageContainer}>
        <Image
          src={consoleImages[consoleName]}
          alt={`${consoleName} console`}
          width={100}
          height={60}
          className={styles.consoleImage}
        />
      </div>
      <div className={styles.content}>
        {renderContent()}
      </div>
    </div>
  );
};