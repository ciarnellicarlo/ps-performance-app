import axios from 'axios';

const API_BASE_URL = 'http://192.168.0.176:8080'; // Replace with your actual backend URL

export interface Game {
  id: string;
  title: string;
  coverArtURL: string;
}

export const searchGames = async (query: string): Promise<Game[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search`, {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching games:', error);
    throw error;
  }
};