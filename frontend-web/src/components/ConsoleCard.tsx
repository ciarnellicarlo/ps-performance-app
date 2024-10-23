// components/ConsoleCard.tsx
import Image from 'next/image';
import { ConsoleType } from '@/types/game';
import styles from '../styles/ConsoleCard.module.scss';

interface ConsoleCardProps {
  consoleName: ConsoleType;
  hasData: boolean;
}

const consoleImages: Record<ConsoleType, string> = {
  'PS4': '/PS4Base.svg',
  'PS4 Pro': '/PS4Pro.svg',
  'PS5': '/PS5Base.svg',
  'PS5 Pro': '/PS5Pro.svg'
};

export const ConsoleCard = ({ consoleName, hasData }: ConsoleCardProps) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{consoleName}</h3>
      <div className={styles.imageContainer}>
        <Image
          src={consoleImages[consoleName]}
          alt={`${consoleName} console`}
          width={200}
          height={120}
          className={styles.consoleImage}
        />
      </div>
      <div className={styles.content}>
        {!hasData && <p className={styles.noData}>N/A</p>}
      </div>
    </div>
  );
};