import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface FilterButtonProps {
  title: string;
  active: boolean;
  onPress: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ title, active, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.button, active && styles.activeButton]}
      onPress={onPress}
    >
      <Text style={[styles.text, active && styles.activeText]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#2B2B3D',
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: '#CA1395',
  },
  text: {
    color: '#FFF',
    fontSize: 14,
  },
  activeText: {
    fontWeight: 'bold',
  },
});

export default FilterButton;