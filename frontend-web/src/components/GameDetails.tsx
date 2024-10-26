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
    <>
      <Header variant="game" title={game.title} />
      <div className={styles.pageContainer}>
        <div className={styles.contentContainer}>
        <div 
  className={styles.coverArtSection}
  style={{ '--game-cover': `url(${coverArtUrl})` } as React.CSSProperties}
>
  <div className={styles.coverArtContainer}>
    <div className={`${styles.platformLogo} ${game.platform === 'PlayStation 4' ? styles.ps4 : styles.ps5}`}>
      <Image
        src={game.platform === 'PlayStation 4' ? '/PS4Logo.svg' : '/PS5Logo.svg'}
        alt={game.platform}
        width={36}
        height={36}
        className={styles.platformImage}
      />
    </div>
    <div className={styles.coverWrapper}>
      <Image
        src={coverArtUrl}
        alt={game.title}
        fill
        style={{ objectFit: 'cover' }}
        priority
      />
    </div>
  </div>
</div>
          <GradientContainer className={styles.detailsSection}>
            <section className={styles.platformInfo}>
              <h2>{game.platform}</h2>
              <time>{game.releaseYear}</time>
            </section>
            <ConsoleCardList 
              consoles={compatibleConsoles} 
              game={game}  // Pass the game object
            />
          </GradientContainer>
        </div>
      </div>
    </>
  );
}