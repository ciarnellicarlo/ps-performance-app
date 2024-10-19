import React, { useState, useEffect, useCallback, useRef } from 'react';
import SearchBar from './SearchBar';
import FilterButton from './FilterButton';
import GameGrid from './GameGrid';
import { searchGames, getRandomGames, Game } from '../api/GameApi';
import styles from '../styles/HomeScreen.module.css';

type FilterType = 'All' | 'PlayStation 4' | 'PlayStation 5';

const HomeScreen: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const initialLoadDone = useRef(false);

  const getConsoleFilter = (filter: FilterType): string => {
    return filter === 'All' ? '' : filter;
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
      setGames(searchResults);
      setHasMore(false);
      if (searchResults.length === 0) {
        setError('No games found');
      }
    } catch (error) {
      setError('Error fetching games');
      console.error('Error fetching games:', error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!initialLoadDone.current) {
      loadGames(1, activeFilter, true);
      initialLoadDone.current = true;
    }
  }, [activeFilter, loadGames]);

  const handleSearch = async (searchText: string) => {
    setSearchQuery(searchText);
    if (searchText.length >= 3) {
      performSearch(searchText, activeFilter);
    } else if (searchText.length === 0) {
      loadGames(1, activeFilter, true);
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
        performSearch(searchQuery, filter);
      } else {
        loadGames(1, filter, true);
      }
    }
  };

  return (
    <div className={styles.container}>
      <SearchBar 
        placeholder="Type game name here..." 
        onSearch={handleSearch}
        initialValue={searchQuery}
      />
      <div className={styles.filterWrapper}>
        <FilterButton
          title="PS4 + PS5"
          active={activeFilter === 'All'}
          onPress={() => handleFilterPress('All')}
        />
        <FilterButton
          title="PS4 Only"
          active={activeFilter === 'PlayStation 4'}
          onPress={() => handleFilterPress('PlayStation 4')}
        />
        <FilterButton
          title="PS5 Only"
          active={activeFilter === 'PlayStation 5'}
          onPress={() => handleFilterPress('PlayStation 5')}
        />
      </div>
      {error ? (
        <div className={styles.message}>{error}</div>
      ) : (
        <GameGrid games={games} onLoadMore={handleLoadMore} isLoading={isLoading} />
      )}
    </div>
  );
};

export default React.memo(HomeScreen);