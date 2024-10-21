import React from 'react';
import SearchBar from './SearchBar';
import FilterButton from './FilterButton';
import GameGrid from './GameGrid';
import useGameFetching from '../hooks/useGameFetching';
import styles from '../styles/HomeScreen.module.scss';
import Header from './Header';

type FilterType = 'All' | 'PlayStation 4' | 'PlayStation 5';

const HomeScreen: React.FC = () => {
  const {
    games,
    isLoading,
    error,
    activeFilter,
    searchQuery,
    handleSearch,
    handleLoadMore,
    handleFilterPress
  } = useGameFetching();

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.innerContainer}>
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