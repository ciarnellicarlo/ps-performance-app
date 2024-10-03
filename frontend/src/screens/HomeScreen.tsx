import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import SearchBar from '../components/SearchBar';
import FilterButton from '../components/FilterButton';
import GameGrid from '../components/GameGrid';
import { searchGames, Game } from '../api/GameApi';

const HomeScreen: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('PS5 + PS4');
  const [games, setGames] = useState<Game[]>([]);

  const handleSearch = async (searchText: string) => {
    try {
      const searchResults = await searchGames(searchText);
      setGames(searchResults);
    } catch (error) {
      console.error('Error fetching games:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <View style={styles.container}>
      <SearchBar placeholder="Type game name here..." onSearch={handleSearch} />
      <ScrollView horizontal style={styles.filterContainer}>
        <FilterButton
          title="PS5 + PS4"
          active={activeFilter === 'PS5 + PS4'}
          onPress={() => setActiveFilter('PS5 + PS4')}
        />
        {/* Add other FilterButtons */}
      </ScrollView>
      <GameGrid games={games} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2E',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

export default HomeScreen;