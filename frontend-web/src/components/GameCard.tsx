import Image from 'next/image';
import Link from 'next/link';
import { Game } from '@/types/game';
import { getOptimizedImageUrl } from '@/utils/images';
import styles from '../styles/GameCard.module.scss';

interface GameCardProps {
  game: Game;
}

export const GameCard = ({ game }: GameCardProps) => (
  <Link href={`/games/${game.id}`} className={styles.gameItem}>
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
        src={getOptimizedImageUrl(game.coverArtURL)}
        alt={game.title}
        fill
        className={styles.gameCover}
      />
    </div>
  </Link>
);