import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ChartComponent from "./market/PriceChart";
import SearchInput from "./market/InputSelector";
import IndicatorComponent from "./market/Indicators";
const Market = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [searchCoin, setSearchCoin] = useState(null);
  const [searchInterval, setSearchInterval] = useState(null);
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const handleSearchResultChange = (result) => {
    setSearchCoin(result);
  };
  const handleSearchInterval = (interval) => {
    setSearchInterval(interval);
  };

  return (
    <div className="container-fluid">
    <div className="row">
      <div className="col-md-2 bg-light mr-4" style={{ height: "100vh" }}>
        <h3>Strategies</h3>
      </div>
      <div className="col-md-8">
        <header className="jumbotron"></header>
        <h2 style={{textAlign:'center'}}>Live updating chart</h2>
        <div style={{width:20, padding:20, boxSizing: 'border-box'}}>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <div>
            <SearchInput
              onSearchResultChange={handleSearchResultChange}
              onSearchIntervalChange={handleSearchInterval}
            />
          </div>
        </div>
        <div style={{ marginTop: 50 }}>
          <ChartComponent coin={searchCoin || "btcusdt"} klinetime={searchInterval || '1m'} />
        </div>
      </div>
    </div>
  </div>
  );
};

export default Market;
