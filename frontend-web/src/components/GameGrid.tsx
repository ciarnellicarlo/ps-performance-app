// components/GameGrid/GameGrid.tsx
import { useCallback, useRef } from 'react';
import { Game } from '@/types/game';
import { GradientContainer } from './GradientContainer';
import { GameCard } from '@/components/GameCard';
import styles from '../styles/GameGrid.module.scss';
import React from 'react';

interface GameGridProps {
  games: Game[];
  onLoadMore: () => void;
  isLoading: boolean;
  isSearching: boolean;
  isInitialLoad: boolean;
}

export const GameGrid = ({ 
  games, 
  onLoadMore, 
  isLoading, 
  isSearching,
  isInitialLoad 
}: GameGridProps) => {
  const observer = useRef<IntersectionObserver | null>(null);
  
  const lastGameElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        onLoadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, onLoadMore]);

  if (isInitialLoad || games.length === 0) {
    return (
      <GradientContainer className={`${styles.gridContainer} ${styles.spinner}`}>
        <div className={styles.initialLoadingContainer}>
          <div className={styles.loadingSpinner} />
          <p className={styles.loadingText}>
            Starting up the backend service...
            <br />
            <span className={styles.loadingSubtext}>
              First load may take up to 30 seconds
            </span>
          </p>
        </div>
      </GradientContainer>
    );
  }

  return (
    <GradientContainer className={styles.gridContainer}>
      {games.map((game, index) => (
        <div 
          key={`${game.id}-${index}`}
          ref={index === games.length - 1 ? lastGameElementRef : null}
        >
          <GameCard game={game} isSearching={isSearching} />
        </div>
      ))}
      {isLoading && <div className={styles.loadingMessage}>Loading more games...</div>}
    </GradientContainer>
  );
};

export default React.memo(GameGrid);