import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

function SearchInput({ onSearchResultChange, onSearchIntervalChange }) {
  const [searchTerm, setSearchTerm] = useState("BTCUSDT");
  const [searchResult, setSearchResult] = useState(null);
  const [options, setOptions] = useState([]);
  const intervalOpt = ["1m", "5m", "15m", "30m", "1h", "4h"];

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get("http://62.109.16.15:3000/coins");
      setOptions(result.data);
    };

    fetchData();
  }, []);

  const handleInputChange = (selectedOption) => {
    if (!selectedOption) return;
    setSearchTerm(selectedOption.value);
    setSearchResult(selectedOption.value);
    if (onSearchResultChange) {
      onSearchResultChange(selectedOption.value);
    }
  };

  const handleIntervalChange = (selectedOption) => {
    if (!selectedOption) return;
    if (onSearchIntervalChange) {
      onSearchIntervalChange(selectedOption.value);
    }
  };

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        right: 0,
        zIndex: 999,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Select
        options={options.map((option) => ({ label: option, value: option }))}
        value={{ label: searchTerm, value: searchTerm }}
        onChange={handleInputChange}
        isClearable
        styles={{
          control: (provided) => ({
            ...provided,
            width: "200px",
            marginRight: "10px",
          }),
          menu: (provided) => ({
            ...provided,
            width: "200px",
          }),
        }}
      />
      <Select
        options={intervalOpt.map((option) => ({
          label: option,
          value: option,
        }))}
        placeholder="1m"
        onChange={handleIntervalChange}
        isClearable
        styles={{
          control: (provided) => ({
            ...provided,
            width: "150px",
            marginRight: "10px",
          }),
          menu: (provided) => ({
            ...provided,
            width: "150px",
          }),
        }}
      />
    </div>
  );
}

export default SearchInput;
