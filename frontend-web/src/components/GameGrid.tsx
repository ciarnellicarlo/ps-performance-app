import React, { useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import styles from '../styles/GameGrid.module.css';
import { Game } from '../api/GameApi';

interface GameGridProps {
  games: Game[];
  onLoadMore: () => void;
  isLoading: boolean;
}

const GameGrid: React.FC<GameGridProps> = ({ games, onLoadMore, isLoading }) => {
  const observer = useRef<IntersectionObserver | null>(null);
  const lastGameElementRef = useRef<HTMLDivElement | null>(null);

  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const handleObserver = useCallback(
    debounce((entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && !isLoading && games.length > 0) {
        onLoadMore();
      }
    }, 200),
    [onLoadMore, isLoading, games.length]
  );

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0,
    };

    observer.current = new IntersectionObserver(handleObserver, options);

    if (lastGameElementRef.current) {
      observer.current.observe(lastGameElementRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [handleObserver]);

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