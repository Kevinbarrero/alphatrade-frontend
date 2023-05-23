import React, { useState, useEffect, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ChartComponent from "./market/PriceChart";
import SearchInput from "./market/InputSelector";
import { getStrategies } from "../services/user.service";
import Table from "react-bootstrap/Table";
import { renderActiveShape } from "../utils/Market";
import {
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function generateComulativeData(data) {
  const combinedData = [
    ...data.short.profit.map((p, i) => ({
      time: new Date(data.short.open.time[i] * 1000 - 10800000),
      profit: p,
    })),
    ...data.long.profit.map((p, i) => ({
      time: new Date(data.long.open.time[i] * 1000 - 10800000),
      profit: p,
    })),
  ];

  // Sort the combinedData array based on the time property in ascending order
  combinedData.sort((a, b) => a.time - b.time);

  // Add a cumulative profit property to each data point
  let cumulativeProfit = 0;
  const dataWithCumulativeProfit = combinedData.map(({ time, profit }) => {
    cumulativeProfit += profit;
    return {
      time: time.toLocaleString(),
      profit,
      cumulativeProfit: parseFloat(cumulativeProfit.toFixed(3)),
    };
  });

  return dataWithCumulativeProfit;
}

function classifyOrders(data) {
  const shortGoodOrders = data.short.profit.filter((p) => p > 0).length;
  const shortBadOrders = data.short.profit.filter((p) => p < 0).length;
  const longGoodOrders = data.long.profit.filter((p) => p > 0).length;
  const longBadOrders = data.long.profit.filter((p) => p < 0).length;
  return [
    { name: "Short Good", value: shortGoodOrders },
    { name: "Short Bad", value: shortBadOrders },
    { name: "Long Good", value: longGoodOrders },
    { name: "Long Bad", value: longBadOrders },
  ];
}

const Market = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [searchCoin, setSearchCoin] = useState(null);
  const [searchInterval, setSearchInterval] = useState(null);
  const [strategies, setStrategies] = useState([]);
  const [strategyBacktest, setStrategyBacktest] = useState(null);
  const [backtestData, setBacktestData] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

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
    console.log("orders data: ", backtest);
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
            <Table striped bordered hover id="strat-table">
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
                      <button onClick={() => handleStrategyBacktest(strategy)} id="back-test-but">
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

          {backtestData && backtestData.short.profit.length !== 0 && (
            <>
              <div style={{ marginTop: 40 }}>
                <h4 style={{ textAlign: "center" }}>
                  Global Profit Analisys %
                </h4>
                <AreaChart
                  width={1200}
                  height={400}
                  data={generateComulativeData(backtestData)}
                >
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="cumulativeProfit"
                    stroke="#8884d8"
                    fill="#8884d8"
                  />
                </AreaChart>
              </div>

              <div
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  marginTop: 30,
                }}
              >
                <h4 style={{ textAlign: "center" }}>
                  Short | long Success Rate
                </h4>
                <PieChart width={600} height={600}>
                  <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={classifyOrders(backtestData)}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    fill="#8884d8"
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                  />
                </PieChart>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Market;
