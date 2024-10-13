import React, { useState } from 'react';
import { View, Image, StyleSheet, FlatList, Text, ActivityIndicator } from 'react-native';
import { Game } from '../api/GameApi';

interface GameGridProps {
  games: Game[] | null;
  hasSearched: boolean;
  onLoadMore: () => Promise<void>;
}

const GameGrid: React.FC<GameGridProps> = ({ games, hasSearched, onLoadMore }) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const getOptimizedImageUrl = (url: string) => {
    // Ensure the URL has a protocol
    let fullUrl = url.startsWith('//') ? `https:${url}` : url;
    if (!fullUrl.startsWith('http')) {
      fullUrl = `https://${fullUrl}`;
    }

    // Replace t_thumb with t_cover_big
    return fullUrl.replace('t_thumb', 't_cover_big');
  };

  const renderItem = ({ item }: { item: Game }) => (
    <View style={styles.gameItem}>
      <Image
        source={{ uri: getOptimizedImageUrl(item.coverArtURL) }}
        style={styles.gameCover}
        resizeMode="cover"
      />
    </View>
  );

  const handleLoadMore = () => {
    if (!isLoadingMore && !hasSearched) {
      setIsLoadingMore(true);
      onLoadMore().finally(() => setIsLoadingMore(false));
    }
  };

  const renderFooter = () => {
    if (isLoadingMore) {
      return <ActivityIndicator size="large" color="#E91E63" />;
    }
    return null;
  };

  if (hasSearched && (!games || games.length === 0)) {
    return (
      <View style={styles.noResultsContainer}>
        <Text style={styles.noResultsText}>No results found</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={games || []}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={3}
      contentContainerStyle={styles.gridContainer}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.1}
      ListFooterComponent={renderFooter}
    />
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    padding: 5,
  },
  gameItem: {
    flex: 1,
    margin: 5,
    aspectRatio: 0.75,
  },
  gameCover: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Poppins_400Regular', // Make sure this matches your font setup
  },
});

export default GameGrid;