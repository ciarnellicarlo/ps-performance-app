import React, { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import styles from '../styles/SearchBar.module.css';

interface SearchBarProps {
  placeholder: string;
  onSearch: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, onSearch }) => {
  const [searchText, setSearchText] = useState('');

  const debouncedSearch = useCallback(
    debounce((text: string) => {
      onSearch(text);
    }, 300),
    [onSearch]
  );

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setSearchText(text);
    debouncedSearch(text);
  };

  return (
    <div className={styles.container}>
      <input
        className={styles.input}
        type="text"
        placeholder={placeholder}
        onChange={handleTextChange}
        value={searchText}
      />
    </div>
  );
};

export default SearchBar;