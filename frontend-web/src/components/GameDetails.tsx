'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getOptimizedImageUrl } from '@/utils/images';
import { Game, ConsoleType, PerformanceSubmission } from '@/types/game';
import { useGameData } from '@/hooks/useGameData';
import Header from './Header';
import styles from '../styles/GameDetails.module.scss';
import { GradientContainer } from './GradientContainer';
import { ConsoleCardList } from './ConsoleCardList';
import { SubmitForm } from './SubmitForm';
import { SubmissionSuccess } from './SubmissionSuccess';

const GameCoverArt = ({ platform, coverArtUrl }: { platform: Game['platform']; coverArtUrl: string }) => (
  <div className={styles.coverArtContainer}>
    <div className={`${styles.platformLogo} ${platform === 'PlayStation 4' ? styles.ps4 : styles.ps5}`}>
      <Image
        src={platform === 'PlayStation 4' ? '/PS4Logo.svg' : '/PS5Logo.svg'}
        alt={platform}
        width={36}
        height={36}
        className={styles.platformImage}
      />
    </div>
    <div className={styles.coverWrapper}>
      <Image
        src={coverArtUrl}
        alt="Game Cover"
        fill
        style={{ objectFit: 'cover' }}
        priority
      />
    </div>
  </div>
);

export default function GameDetails({ game: initialGame }: { game: Game }) {
  const [isSubmitView, setIsSubmitView] = useState(false);
  const [isSubmissionSuccess, setIsSubmissionSuccess] = useState(false);
  const [selectedConsole, setSelectedConsole] = useState<ConsoleType | null>(null);

  const {
    game,
    isLoading,
    error,
    submitPerformance
  } = useGameData(initialGame);

  const coverArtUrl = getOptimizedImageUrl(game.coverArtURL, 't_720p');
  const compatibleConsoles: ConsoleType[] = 
    game.platform === 'PlayStation 4' 
      ? ['PS4', 'PS4 Pro', 'PS5', 'PS5 Pro']
      : ['PS5', 'PS5 Pro'];

  const handleSubmitClick = (consoleType: ConsoleType) => {
    setSelectedConsole(consoleType);
    setIsSubmitView(true);
  };

  const handleBackToHome = async () => {
    setIsSubmitView(false);
    setIsSubmissionSuccess(false);
    setSelectedConsole(null);
  };

  const handleSubmitSuccess = async (data: PerformanceSubmission) => {
    const success = await submitPerformance(data);
    if (success) {
      setIsSubmissionSuccess(true);
    }
  };

  if (error) {
    return <div>Error loading game data</div>;
  }

  return (
    <>
      <Header variant="game" title={game.title} />
      <div className={styles.pageContainer}>
        <div className={styles.contentContainer}>
          <div 
            className={`${styles.coverArtSection} ${isSubmitView ? styles.coverArtSectionSmall : ''}`}
            style={{ '--game-cover': `url(${coverArtUrl})` } as React.CSSProperties}
          >
            <GameCoverArt platform={game.platform} coverArtUrl={coverArtUrl} />
          </div>

          <GradientContainer 
            className={`${styles.detailsSection} ${isSubmitView ? styles.detailsSectionLarge : ''}`}
          >
            {!isSubmitView ? (
              <>
                <section className={styles.platformInfo}>
                  <h2>{game.platform}</h2>
                  <time>{game.releaseYear}</time>
                </section>
                <ConsoleCardList 
                  consoles={compatibleConsoles} 
                  game={game}
                  onSubmitClick={handleSubmitClick}
                />
              </>
            ) : (
              <div className={styles.submitView}>
                {isSubmissionSuccess ? (
                  <SubmissionSuccess 
                    title={game.title}
                    onBackToHome={handleBackToHome}
                    isLoading={isLoading}
                  />
                ) : (
                  isSubmitView && selectedConsole && (
                    <SubmitForm 
                      gameId={game.id}
                      consoleName={selectedConsole}
                      onSubmit={handleSubmitSuccess}
                    />
                  )
                )}
              </div>
            )}
          </GradientContainer>
        </div>
      </div>
    </>
  );
}