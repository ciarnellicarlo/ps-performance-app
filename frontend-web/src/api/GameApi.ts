import axios from 'axios';
import { Game } from '@/types/game';  // Import the Game interface
import { API_BASE_URL } from '@/config/config';

// Remove type definitions since they should be in /types/game.ts

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

export type { Game };
