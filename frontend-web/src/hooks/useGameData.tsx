// hooks/useGameData.ts
import { useState, useCallback } from 'react';
import { Game, PerformanceSubmission } from '@/types/game';
import { getGameById, submitPerformanceData } from '@/services/api';

export const useGameData = (initialGame: Game) => {
  const [game, setGame] = useState<Game>(initialGame);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshGameData = useCallback(async () => {
    try {
      setIsLoading(true);
      const updatedGame = await getGameById(game.id);
      setGame(updatedGame);
    } catch (err) {
      setError('Failed to refresh game data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [game.id]);

  const submitPerformance = useCallback(async (data: PerformanceSubmission) => {
    try {
      setIsLoading(true);
      await submitPerformanceData(data);
      await refreshGameData(); // Refresh data after submission
      return true;
    } catch (err) {
      setError('Failed to submit performance data');
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [refreshGameData]);

  return {
    game,
    isLoading,
    error,
    refreshGameData,
    submitPerformance
  };
};