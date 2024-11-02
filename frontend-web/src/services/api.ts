// src/services/games.ts
import axios from 'axios';
import { Game, ConsoleType, ConsolePerformance, PerformanceSubmission } from '@/types/game';
import { API_BASE_URL } from '@/config/config';

// Existing functions
export const getGameById = async (id: string): Promise<Game> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/games/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch game: ${error}`);
  }
};

export const searchGames = async (query: string, consoleFilter: string): Promise<Game[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search`, {
      params: { q: query, console: consoleFilter },
    });
    return response.data || [];
  } catch (error) {
    throw new Error(`Failed to search games: ${error}`);
  }
};

export const getRandomGames = async (page: number, consoleFilter: string): Promise<Game[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/random-games`, {
      params: { page, console: consoleFilter },
    });
    return response.data || [];
  } catch (error) {
    throw new Error(`Failed to fetch random games: ${error}`);
  }
};

// New function for submitting performance data
export const submitPerformanceData = async (data: PerformanceSubmission): Promise<void> => {
  try {
    // Remove any trailing slashes from API_BASE_URL
    const baseUrl = API_BASE_URL.replace(/\/+$/, '');
    
    const response = await axios.post(
      `${baseUrl}/games/${data.gameId}/performance`,
      data,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Response:', response);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Request config:', error.config);
      console.error('Detailed error:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
    }
    throw new Error(`Failed to submit performance data: ${error}`);
  }
};