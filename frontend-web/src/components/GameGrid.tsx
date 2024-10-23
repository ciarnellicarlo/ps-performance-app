import React, { useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Game } from '../api/GameApi';
import styles from '../styles/GameGrid.module.scss';
import { getOptimizedImageUrl } from '@/utils/images';
import { GradientContainer } from './GradientContainer';

interface GameGridProps {
  games: Game[];
  onLoadMore: () => void;
  isLoading: boolean;
}

const GameGrid: React.FC<GameGridProps> = ({ games, onLoadMore, isLoading }) => {
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

  return (
    <GradientContainer className={styles.gridContainer}>
      {games.map((game, index) => (
        <Link 
          href={`/games/${game.id}`} 
          key={`${game.id}-${index}`}
          className={styles.gameItem}
        >
          <div ref={index === games.length - 1 ? lastGameElementRef : null}>
            <Image
              src={getOptimizedImageUrl(game.coverArtURL)}
              alt={game.title}
              layout="fill"
              objectFit="cover"
              className={styles.gameCover}
            />
            <div className={styles.gameTitle}>{game.title}</div>
          </div>
        </Link>
      ))}
      {isLoading && <div className={styles.loadingMessage}>Loading more games...</div>}
    </GradientContainer>
  );
};

export default React.memo(GameGrid);