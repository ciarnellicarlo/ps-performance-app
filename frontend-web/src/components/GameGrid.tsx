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
          <div 
            ref={index === games.length - 1 ? lastGameElementRef : null}
            className={styles.coverWrapper}
          >
            <div className={`${styles.platformLogo} ${game.platform === 'PlayStation 4' ? styles.ps4 : styles.ps5}`}>
              <Image
                src={game.platform === 'PlayStation 4' ? '/PS4Logo.svg' : '/PS5Logo.svg'}
                alt={game.platform}
                width={36}
                height={36}
              />
            </div>
            <Image
              src={getOptimizedImageUrl(game.coverArtURL)}
              alt={game.title}
              layout="fill"
              objectFit="cover"
              className={styles.gameCover}
            />
          </div>
        </Link>
      ))}
      {isLoading && <div className={styles.loadingMessage}>Loading more games...</div>}
    </GradientContainer>
  );
};

export default React.memo(GameGrid);