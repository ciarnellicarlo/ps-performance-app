import React, { useCallback, useRef } from 'react';
import Image from 'next/image';
import { Game } from '../api/GameApi';
import styles from '../styles/GameGrid.module.scss';

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

  const getOptimizedImageUrl = (url: string) => {
    if (!url) return '/default_cover.jpg';
    let fullUrl = url.startsWith('//') ? `https:${url}` : url;
    if (!fullUrl.startsWith('http')) {
      fullUrl = `https://${fullUrl}`;
    }
    return fullUrl.replace('t_thumb', 't_cover_big');
  };

  return (
    <div className={styles.gridContainer}>
      {games.map((game, index) => (
        <div 
          key={`${game.id}-${index}`} 
          className={styles.gameItem}
          ref={index === games.length - 1 ? lastGameElementRef : null}
        >
          <Image
            src={getOptimizedImageUrl(game.coverArtURL)}
            alt={game.title}
            layout="fill"
            objectFit="cover"
            className={styles.gameCover}
          />
          <div className={styles.gameTitle}>{game.title}</div>
        </div>
      ))}
      {isLoading && <div className={styles.loadingMessage}>Loading more games...</div>}
    </div>
  );
};

export default React.memo(GameGrid);