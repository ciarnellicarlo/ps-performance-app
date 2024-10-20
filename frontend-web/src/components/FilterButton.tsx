import React from 'react';
import styles from '../styles/FilterButton.module.scss';

interface FilterButtonProps {
  title: string;
  active: boolean;
  onPress: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ title, active, onPress }) => {
  return (
    <button
      className={`${styles.button} ${active ? styles.activeButton : styles.inactiveButton}`}
      onClick={onPress}
    >
      <span className={`${styles.text} ${active && styles.activeText}`}>{title}</span>
    </button>
  );
};

export default FilterButton;