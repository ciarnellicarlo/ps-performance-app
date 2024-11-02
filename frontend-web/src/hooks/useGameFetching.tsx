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
  const initialLoadDone = useRef(false);

  const getConsoleFilter = (filter: FilterType): string => {
    return filter === 'All' ? '' : filter;
  };

  const handleSearch = async (searchText: string) => {
    try {
      setIsSearching(true);
      setSearchQuery(searchText);
      
      if (searchText.length >= 3) {
        await performSearch(searchText, activeFilter);
      } else if (searchText.length === 0) {
        await loadGames(1, activeFilter, true);
      }
    } finally {
      setIsSearching(false);
    }
  };

  const loadGames = useCallback(async (pageNum: number, filter: FilterType, isNewFilter: boolean) => {
    if (isLoading || (!hasMore && !isNewFilter)) return;
    setIsLoading(true);
    setError(null);
    try {
      console.log(`Fetching games for page ${pageNum}, filter: ${filter}`);
      const newGames = await getRandomGames(pageNum, getConsoleFilter(filter));
      console.log(`Received ${newGames.length} games for page ${pageNum}`);
      if (Array.isArray(newGames) && newGames.length > 0) {
        setGames(prev => isNewFilter ? newGames : [...prev, ...newGames]);
        setPage(prevPage => isNewFilter ? 2 : prevPage + 1);
        setHasMore(newGames.length === 12); // Assuming 12 is the page size
      } else {
        setHasMore(false);
      }
    } catch (error) {
      setError('Failed to load games');
      console.error('Error loading games:', error);
    }
    setIsLoading(false);
  }, [isLoading]);

  const performSearch = useCallback(async (query: string, filter: FilterType) => {
    setIsLoading(true);
    setError(null);
    try {
      const searchResults = await searchGames(query, getConsoleFilter(filter));
      console.log('Search Results:', searchResults); // Log the results
      if (searchResults && searchResults.length > 0) {
        console.log('First game ID:', searchResults[0].id); // Check the ID
      }
      setGames(searchResults);
      setHasMore(false);
      if (searchResults.length === 0) {
        setError('No games found');
      }
    } catch (error) {
      setError('Error fetching games');
      console.error('Error fetching games:', error);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    if (!initialLoadDone.current) {
      loadGames(1, activeFilter, true);
      initialLoadDone.current = true;
    }
  }, [activeFilter, loadGames]);

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
        performSearch(searchQuery, filter);
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