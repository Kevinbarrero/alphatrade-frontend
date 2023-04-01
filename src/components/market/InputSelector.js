import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

function SearchInput({ onSearchResultChange, onSearchIntervalChange }) {
  const [searchTerm, setSearchTerm] = useState('BTCUSDT');
  const [setSearchResult] = useState(null);
  const [options, setOptions] = useState([]);
  const intervalOpt = ['1m', '5m', '15m', '30m', '1h', '4h'];

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('http://92.63.105.48:3000/coins');
      setOptions(result.data);
    };

    fetchData();
  }, []);

  const handleInputChange = (selectedOption) => {
    setSearchTerm(selectedOption.value);
    setSearchResult(selectedOption.value);
    // Call the onSearchResultChange callback function with the updated search result
    if (onSearchResultChange) {
      onSearchResultChange(selectedOption.value);
    }
  };

  const handleIntervalChange = (selectedOption) => {
    // Call the onSearchIntervalChange callback function with the updated interval
    if (onSearchIntervalChange) {
      onSearchIntervalChange(selectedOption.value);
    }
  };

  return (
    <div style={{position: 'sticky', top: 0, right: 0, zIndex: 999, display: 'flex', alignItems: 'center'}}>
      <Select
        options={options.map(option => ({label: option, value: option}))}
        value={{label: searchTerm, value: searchTerm}}
        onChange={handleInputChange}
        isClearable
        styles={{
          control: provided => ({
            ...provided,
            width: '200px',
            marginRight: '10px'
          }),
          menu: provided => ({
            ...provided,
            width: '200px'
          })
        }}
      />
      <Select
        options={intervalOpt.map(option => ({label: option, value: option}))}
        placeholder="1m"
        onChange={handleIntervalChange}
        isClearable
        styles={{
          control: provided => ({
            ...provided,
            width: '150px',
            marginRight: '10px'
          }),
          menu: provided => ({
            ...provided,
            width: '150px'
          })
        }}
      />
    </div>
  );
}

export default SearchInput;
