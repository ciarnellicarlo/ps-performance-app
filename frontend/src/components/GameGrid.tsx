import React from 'react';
import { View, Image, StyleSheet, FlatList } from 'react-native';
import { Game } from '../api/GameApi';

interface GameGridProps {
  games: Game[];
}

const GameGrid: React.FC<GameGridProps> = ({ games }) => {
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

  return (
    <FlatList
      data={games}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={3}
      contentContainerStyle={styles.gridContainer}
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
});

export default GameGrid;