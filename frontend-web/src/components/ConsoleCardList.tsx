import { ConsoleType, Game } from '@/types/game';
import { ConsoleCard } from './ConsoleCard';
import styles from '../styles/ConsoleCardList.module.scss';

type ConsoleCardListProps = {
  consoles: ConsoleType[];
  game: Game;  // Add game prop to access performance data
}

export const ConsoleCardList = ({ consoles, game }: ConsoleCardListProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.scrollArea}>
        {consoles.map(console => (
          <ConsoleCard
            key={console}
            consoleName={console}
            performance={game.compatibleConsoles[console]}
          />
        ))}
      </div>
    </div>
  );
};