import { Game } from '@/types/game'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

export async function getGameById(id: string): Promise<Game> {
  const res = await fetch(`${API_BASE_URL}/games/${id}`)
  
  if (!res.ok) {
    throw new Error(`Failed to fetch game: ${res.statusText}`)
  }

  return res.json()
}

export async function getRandomGames(page: number, consoleFilter: string): Promise<Game[]> {
  const res = await fetch(`${API_BASE_URL}/random-games?page=${page}&console=${consoleFilter}`)
  
  if (!res.ok) {
    throw new Error(`Failed to fetch games: ${res.statusText}`)
  }

  return res.json()
}

export async function searchGames(query: string, consoleFilter: string): Promise<Game[]> {
  const res = await fetch(`${API_BASE_URL}/search?q=${query}&console=${consoleFilter}`)
  
  if (!res.ok) {
    throw new Error(`Failed to search games: ${res.statusText}`)
  }

  return res.json()
}