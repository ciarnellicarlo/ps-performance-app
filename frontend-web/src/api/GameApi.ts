import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';


export type Performance = {
  fps: number;
  resolution: string;
};

export type ConsolePerformance = {
  hasGraphicsSettings: boolean | null;
  fidelityMode?: Performance;
  performanceMode?: Performance;
  standardMode?: Performance;
};

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

export const searchGames = async (query: string, consoleFilter: string): Promise<Game[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search`, {
      params: { q: query, console: consoleFilter },
    });
    return response.data || [];
  } catch (error) {
    console.error('Error searching games:', error);
    return [];
  }
};

export const getRandomGames = async (page: number, consoleFilter: string): Promise<Game[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/random-games`, {
      params: { page, console: consoleFilter },
    });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching random games:', error);
    return [];
  }
};