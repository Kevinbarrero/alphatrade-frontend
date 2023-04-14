import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ChartComponent from "./market/PriceChart";
import SearchInput from "./market/InputSelector";
import { getStrategies } from "../services/user.service";
import Table from "react-bootstrap/Table";

const Market = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [searchCoin, setSearchCoin] = useState(null);
  const [searchInterval, setSearchInterval] = useState(null);
  const [strategies, setStrategies] = useState([]);
  const [strategyBacktest, setStrategyBacktest] = useState(null);
  const [backtestData, setBacktestData] = useState(null);

  const loadStrategies = async () => {
    try {
      const response = await getStrategies();
      setStrategies(response.data);
    } catch (error) {
      console.error("Error loading strategies:", error);
    }
  };
  useEffect(() => {
    loadStrategies();
  }, []);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const handleSearchResultChange = (result) => {
    setSearchCoin(result);
  };
  const handleSearchInterval = (interval) => {
    setSearchInterval(interval);
  };
  const handleStrategyBacktest = (strategy) => {
    setStrategyBacktest(strategy);
  };
  const handleBacktestDataChange = (backtest) => {
    setBacktestData(backtest);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div
          className="col-md-2 bg-light mr-4"
          style={{ height: "100vh", marginTop: 174 }}
        >
          <h3>Strategies</h3>
          {strategies.length !== 0 && (
            <Table striped bordered hover>
              <thead className="thead-dark">
                <tr>
                  <th>Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {strategies.map((strategy, index) => (
                  <tr key={index}>
                    <td>{strategy.name}</td>
                    <td>
                      <button onClick={() => handleStrategyBacktest(strategy)}>
                        Run Backtest
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
        <div className="col-md-8">
          <header className="jumbotron"></header>
          <h2 style={{ textAlign: "center" }}>Live updating chart</h2>
          <div
            style={{ width: 20, padding: 20, boxSizing: "border-box" }}
          ></div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <div>
              <SearchInput
                onSearchResultChange={handleSearchResultChange}
                onSearchIntervalChange={handleSearchInterval}
              />
            </div>
          </div>
          <div style={{ marginTop: 50 }}>
            <ChartComponent
              coin={searchCoin || "btcusdt"}
              klinetime={searchInterval || "1m"}
              onHandleStrategyBacktest={strategyBacktest}
              onBacktestDataChange={handleBacktestDataChange}
            />
          </div>

          {backtestData && (
            <>
              <h6>
                Global Profit Sum: {" "}
                {(backtestData.short.profit.reduce(
                  (acc, curr) => acc + curr,
                  0
                ) +
                  backtestData.long.profit.reduce((acc, curr) => acc + curr, 0)).toFixed(3)}
                  %
              </h6>
              <table className="table table-bordered table-striped table-hover">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Open</th>
                    <th>Close</th>
                    <th>Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {backtestData.short.close.map((openPrice, index) => (
                    <tr key={index}>
                      <td>Short</td>
                      <td>{backtestData.short.open[index].toFixed(3)}</td>
                      <td>{openPrice.toFixed(3)}</td>
                      <td>{backtestData.short.profit[index].toFixed(3)} %</td>
                    </tr>
                  ))}
                  {backtestData.long.close.map((openPrice, index) => (
                    <tr key={index}>
                      <td>Long</td>
                      <td>{backtestData.long.close[index].toFixed(3)}</td>
                      <td>{openPrice.toFixed(3)}</td>
                      <td>{backtestData.long.profit[index].toFixed(3)} %</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Market;
