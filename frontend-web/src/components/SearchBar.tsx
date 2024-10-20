import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../styles/SearchBar.module.css';


interface SearchBarProps {
  placeholder: string;
  onSearch: (text: string, immediate: boolean) => void;
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
    onSearch(text, false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(searchText, true);
    }
  };

  const handleIconClick = () => {
    onSearch(searchText, true);
  };

  return (
    <div className={styles.container}>
      <Image 
        src="/PlaystationLogo.svg"
        alt="PlayStation Logo"
        width={24}
        height={24}
        className={styles.playstationLogo}
      />
      <input
        className={`${styles.input} font-sans`}
        type="text"
        placeholder={placeholder}
        onChange={handleTextChange}
        onKeyDown={handleKeyPress}
        value={searchText}
      />
      <Image 
        src="/MagnifyingGlass.svg"
        alt="Search"
        width={20}
        height={20}
        className={styles.searchIcon}
        onClick={handleIconClick}
        style={{ cursor: 'pointer' }}
      />
    </div>
  );
};

export default SearchBar;