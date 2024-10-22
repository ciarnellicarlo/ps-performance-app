import Image from 'next/image';
import { getOptimizedImageUrl } from '@/utils/images';
import { Game, ConsoleType, ConsolePerformance } from '@/types/game';
import Header from './Header';
import styles from '../styles/GameDetails.module.scss';

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
    game.platform === 'PS4' 
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
        
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4">{game.title}</h1>
          <div className="space-y-2 mb-6">
            <p className="text-gray-300">Release Year: {game.releaseYear}</p>
            <p className="text-gray-300">Platform: {game.platform}</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Performance Data</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {compatibleConsoles.map(consoleType => (
            game.compatibleConsoles[consoleType] && (
              <PerformanceData
                key={consoleType}
                performance={game.compatibleConsoles[consoleType]!}
                consoleType={consoleType}
              />
            )
          ))}
        </div>
      </div>
    </div>
  );
}