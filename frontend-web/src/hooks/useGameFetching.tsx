import { useState, useCallback, useEffect, useRef } from 'react';
import { Game, searchGames, getRandomGames } from '../api/GameApi';

type FilterType = 'All' | 'PlayStation 4' | 'PlayStation 5';

const useGameFetching = (initialFilter: FilterType = 'All') => {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>(initialFilter);
  const [isSearching, setIsSearching] = useState(false);
  const mountedRef = useRef(false); 


  const getConsoleFilter = (filter: FilterType): string => {
    return filter === 'All' ? '' : filter;
  };

  const loadGames = useCallback(async (pageNum: number, filter: FilterType, isNewFilter: boolean) => {

    if (!hasMore && !isNewFilter) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const newGames = await getRandomGames(pageNum, getConsoleFilter(filter));
      
      if (Array.isArray(newGames) && newGames.length > 0) {
        setGames(prev => isNewFilter ? newGames : [...prev, ...newGames]);
        setPage(prevPage => isNewFilter ? 2 : prevPage + 1);
        setHasMore(newGames.length === 12);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      setError('Failed to load games');
    } finally {
      setIsLoading(false);
      // Only update initial load state if this was the first load

    }
  }, [hasMore]); // Removed isLoading from dependencies

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      loadGames(1, activeFilter, true);
    }
  }, []);

  const handleSearch = async (searchText: string) => {
    setSearchQuery(searchText);
    setIsSearching(true);
    
    try {
      if (searchText.length >= 3) {
        setIsLoading(true);
        const searchResults = await searchGames(searchText, getConsoleFilter(activeFilter));
        setGames(searchResults);
        setHasMore(false);
        if (searchResults.length === 0) {
          setError('No games found');
        }
      } else if (searchText.length === 0) {
        await loadGames(1, activeFilter, true);
      }
    } catch (error) {
      setError('Error fetching games');
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };

  const handleLoadMore = () => {
    if (!isLoading && hasMore && games.length > 0) {
      loadGames(page, activeFilter, false);
    }
  };

  const handleFilterPress = (filter: FilterType) => {
    if (filter !== activeFilter) {
      setActiveFilter(filter);
      setPage(1);
      setHasMore(true);
      setGames([]);
      
      if (searchQuery.length >= 3) {
        handleSearch(searchQuery);
      } else {
        loadGames(1, filter, true);
      }
    }
  };

  return {
    games,
    isLoading,
    error,
    hasMore,
    activeFilter,
    searchQuery,
    handleSearch,
    handleLoadMore,
    handleFilterPress,
    isSearching,
  };
};

export default useGameFetching;