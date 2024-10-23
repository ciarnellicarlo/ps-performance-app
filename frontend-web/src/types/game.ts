export interface Performance {
  fps: number;
  resolution: string;
}

export interface ConsolePerformance {
  hasGraphicsSettings: boolean | null;
  fidelityMode?: Performance;
  performanceMode?: Performance;
  standardMode?: Performance;
}

export type Platform = 'PlayStation 4' | 'PlayStation 5';
export type ConsoleType = 'PS4' | 'PS4 Pro' | 'PS5' | 'PS5 Pro';

export interface Game {
  id: string;
  title: string;
  coverArtURL: string;
  releaseYear: number;
  platform: Platform;
  compatibleConsoles: {
    [key in ConsoleType]?: ConsolePerformance;
  };
}