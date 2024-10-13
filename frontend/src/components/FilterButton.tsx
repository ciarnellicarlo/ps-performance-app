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
      style={[styles.button, active ? styles.activeButton : styles.inactiveButton]}
      onPress={onPress}
    >
      <Text style={[styles.text, active && styles.activeText]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20, // Assuming this is the value for var(--RadiusTotal)
  },
  activeButton: {
    backgroundColor: '#CA1395',
  },
  inactiveButton: {
    backgroundColor: '#252252',
  },
  text: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Poppins_300Light'
  },
  activeText: {
    fontWeight: 'bold',
  },
});

export default FilterButton;