import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import SearchBar from '../components/SearchBar';
import FilterButton from '../components/FilterButton';
import GameGrid from '../components/GameGrid';
import { searchGames, getRandomGames, Game } from '../api/GameApi';

const { width } = Dimensions.get('window');
const WRAPPER_WIDTH = width - 52; // Assuming 15px padding on each side

type FilterType = 'PS5 + PS4' | 'PS4 Only' | 'PS5 Only';

const HomeScreen: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('PS5 + PS4');
  const [games, setGames] = useState<Game[] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);

  const loadRandomGames = useCallback(async (currentPage: number) => {
    try {
      const randomGames = await getRandomGames(currentPage);
      setGames(prevGames => (prevGames ? [...prevGames, ...randomGames] : randomGames));
      setPage(currentPage + 1);
    } catch (error) {
      console.error('Error fetching random games:', error);
    }
  }, []);

  useEffect(() => {
    loadRandomGames(1);
  }, [loadRandomGames]);

  const handleSearch = async (searchText: string) => {
    setHasSearched(true);
    if (searchText.length >= 3) {
      try {
        const searchResults = await searchGames(searchText);
        setGames(searchResults);
      } catch (error) {
        console.error('Error fetching games:', error);
        setGames([]);
      }
    } else {
      setHasSearched(false);
      setPage(1);
      await loadRandomGames(1);
    }
  };

  const handleLoadMore = async () => {
    if (!hasSearched) {
      await loadRandomGames(page);
    }
  };

  const handleFilterPress = (filter: FilterType) => {
    setActiveFilter(filter);
    // Here you would typically filter the games based on the selected filter
    // For now, we'll just log the filter change
    console.log(`Filter changed to: ${filter}`);
  };


  return (
    <View style={styles.container}>
      <SearchBar placeholder="Type game name here..." onSearch={handleSearch} />
      <View style={styles.filterWrapper}>
        <FilterButton
          title="PS5 + PS4"
          active={activeFilter === 'PS5 + PS4'}
          onPress={() => handleFilterPress('PS5 + PS4')}
        />
        <FilterButton
          title="PS4 Only"
          active={activeFilter === 'PS4 Only'}
          onPress={() => handleFilterPress('PS4 Only')}
        />
        <FilterButton
          title="PS5 Only"
          active={activeFilter === 'PS5 Only'}
          onPress={() => handleFilterPress('PS5 Only')}
        />
      </View>
      <GameGrid games={games} hasSearched={hasSearched} onLoadMore={handleLoadMore} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2E',
    paddingHorizontal: 26,
  },
  filterWrapper: {
    width: WRAPPER_WIDTH,
    height: 43,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 4,
    marginBottom: 10,
    backgroundColor: '#252252',
    borderRadius: 20, // Assuming this is the value for var(--RadiusTotal)
  },
});

export default HomeScreen;