'use client';

import { useState } from 'react';

import Image from 'next/image';
import { getOptimizedImageUrl } from '@/utils/images';
import { Game, ConsoleType } from '@/types/game';
import Header from './Header';
import styles from '../styles/GameDetails.module.scss';
import { GradientContainer } from './GradientContainer';
import { ConsoleCardList } from './ConsoleCardList';
import { SubmitForm } from './SubmitForm';
import { PerformanceSubmission } from '@/types/game';
import { SubmissionSuccess } from './SubmissionSuccess';

export default function GameDetails({ game }: { game: Game }) {
  const [isSubmitView, setIsSubmitView] = useState(false);
  const [isSubmissionSuccess, setIsSubmissionSuccess] = useState(false);
  const [selectedConsole, setSelectedConsole] = useState<ConsoleType | null>(null);
  const coverArtUrl = getOptimizedImageUrl(game.coverArtURL, 't_720p');
  const compatibleConsoles: ConsoleType[] = 
    game.platform === 'PlayStation 4' 
      ? ['PS4', 'PS4 Pro', 'PS5', 'PS5 Pro']
      : ['PS5', 'PS5 Pro'];

      const handleSubmitClick = (consoleType: ConsoleType) => {
        setSelectedConsole(consoleType);
        setIsSubmitView(true);
      };

      const handleBackToHome = () => {
        // You can either redirect to home or just reset the view
        setIsSubmitView(false);
        setIsSubmissionSuccess(false);
      };

  return (
    <>
      <Header variant="game" title={game.title} />
      <div className={styles.pageContainer}>
        <div className={styles.contentContainer}>
          <div 
            className={`${styles.coverArtSection} ${isSubmitView ? styles.coverArtSectionSmall : ''}`}
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
      onSubmitClick={handleSubmitClick}  // Pass the console type up
    />
              </>
            ) : (
              <div className={styles.submitView}>
              {isSubmissionSuccess ? (
                <SubmissionSuccess 
                  title={game.title}
                  onBackToHome={handleBackToHome}
                />
              ) : (
                isSubmitView && selectedConsole && (
                  <SubmitForm 
                    gameId={game.id}
                    consoleName={selectedConsole}
                    onSubmit={(data: PerformanceSubmission) => {
                      console.log(data);
                      setIsSubmissionSuccess(true);
                    }}
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