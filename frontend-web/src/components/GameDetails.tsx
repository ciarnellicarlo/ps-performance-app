import Image from 'next/image';
import { getOptimizedImageUrl } from '@/utils/images';
import { Game, ConsoleType, ConsolePerformance } from '@/types/game';
import Header from './Header';
import styles from '../styles/GameDetails.module.scss';
import { GradientContainer } from './GradientContainer';
import { ConsoleCardList } from './ConsoleCardList';

interface PerformanceDataProps {
  performance: ConsolePerformance;
  consoleType: ConsoleType;
}

const PerformanceData = ({ performance, consoleType }: PerformanceDataProps) => {
  if (performance.hasGraphicsSettings === null) {
    return (
      <div className="mb-6 bg-secondary p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-2">{consoleType}</h3>
        <div className="mt-4">
          <p className="text-yellow-400">Performance data not yet available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 bg-secondary p-4 rounded-lg">
      <h3 className="text-lg font-medium mb-4">{consoleType}</h3>

      {performance.hasGraphicsSettings ? (
        <div className="space-y-4">
          {performance.fidelityMode && (
            <div className="bg-secondary/50 p-3 rounded">
              <h4 className="font-medium text-sm mb-2">Fidelity Mode</h4>
              <p>FPS: {performance.fidelityMode.fps || 'N/A'}</p>
              <p>Resolution: {performance.fidelityMode.resolution || 'N/A'}</p>
            </div>
          )}
          {performance.performanceMode && (
            <div className="bg-secondary/50 p-3 rounded">
              <h4 className="font-medium text-sm mb-2">Performance Mode</h4>
              <p>FPS: {performance.performanceMode.fps || 'N/A'}</p>
              <p>Resolution: {performance.performanceMode.resolution || 'N/A'}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-secondary/50 p-3 rounded">
          <h4 className="font-medium text-sm mb-2">Standard Mode</h4>
          <p>FPS: {performance.standardMode?.fps || 'N/A'}</p>
          <p>Resolution: {performance.standardMode?.resolution || 'N/A'}</p>
        </div>
      )}
    </div>
  );
};

export default function GameDetails({ game }: { game: Game }) {
  const coverArtUrl = getOptimizedImageUrl(game.coverArtURL, 't_720p');
  const compatibleConsoles: ConsoleType[] = 
    game.platform === 'PlayStation 4' 
      ? ['PS4', 'PS4 Pro', 'PS5', 'PS5 Pro']
      : ['PS5', 'PS5 Pro'];

      return (
        <div className="p-4 max-w-4xl mx-auto">
          <Header variant="game" title={game.title} />
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div 
              className={styles.coverArtSection}
              style={{ '--game-cover': `url(${coverArtUrl})` } as React.CSSProperties}
            >
              <div className={styles.coverArtContainer}>
                <Image
                  src={coverArtUrl}
                  alt={game.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </div>
            </div>
            <GradientContainer>
              <section className={styles.platformInfo}>
                <h2>{game.platform === 'PlayStation 4' ? 'PlayStation 4' : 'PlayStation 5'}</h2>
                <time>{game.releaseYear}</time>
              </section>
            <ConsoleCardList consoles={compatibleConsoles} />
            </GradientContainer>
          </div>
        </div>
      );
}