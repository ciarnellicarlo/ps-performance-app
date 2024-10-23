// components/ConsoleCardList.tsx
import { ConsoleType } from '@/types/game';
import { ConsoleCard } from './ConsoleCard';
import styles from '../styles/ConsoleCardList.module.scss';

type ConsoleCardListProps = {
  consoles: ConsoleType[];
}

export const ConsoleCardList = ({ consoles }: ConsoleCardListProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.scrollArea}>
        {consoles.map(console => (
          <ConsoleCard
            key={console}
            consoleName={console}
            hasData={false} // We'll handle this later
          />
        ))}
      </div>
    </div>
  );
};