import React, { useState, useEffect } from 'react';
import styles from '../styles/SearchBar.module.css';

interface SearchBarProps {
  placeholder: string;
  onSearch: (text: string) => void;
  initialValue: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, onSearch, initialValue }) => {
  const [searchText, setSearchText] = useState(initialValue);

  useEffect(() => {
    setSearchText(initialValue);
  }, [initialValue]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setSearchText(text);
    onSearch(text);
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