'use client';

import { ConsoleType, Game } from '@/types/game';
import { ConsoleCard } from './ConsoleCard';
import styles from '../styles/ConsoleCardList.module.scss';

type ConsoleCardListProps = {
    consoles: ConsoleType[];
    game: Game;
    onSubmitClick: (consoleType: ConsoleType) => void;  // Update type
  }
  
  export const ConsoleCardList = ({ consoles, game, onSubmitClick }: ConsoleCardListProps) => {
    return (
      <div className={styles.container}>
        <div className={styles.scrollArea}>
          {consoles.map(consoleType => (
            <ConsoleCard
              key={consoleType}
              consoleName={consoleType}
              performance={game.compatibleConsoles[consoleType]}
              onSubmitClick={() => onSubmitClick(consoleType)}  // Pass the console type
            />
          ))}
        </div>
      </div>
    );
  };