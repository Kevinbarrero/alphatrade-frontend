import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import StrategyConfig from "./strategies/StrategyConfig";
import { getStrategies } from "../services/user.service";
import Table from "react-bootstrap/Table";
import { delStrategy } from "../services/user.service";
const Strategies = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [strategies, setStrategies] = useState([]);

  const [isFormOpen, setIsFormOpen] = useState(false);

  const strategiesChange = (strategy) => {
    setStrategies([...strategies, strategy]);
  };
  const handleSaveStrategy = () => {
    setIsFormOpen(false);
  };
  const handleDeleteStrategy = (value) => {
    const s = strategies.splice(value, 1);
    setStrategies([...strategies]);
    delStrategy(s[0]);
  };
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

  return (
    <div className="container-fluid">
      <header className="jumbotron">
        <h3>Custom Strategies</h3>

      </header>
      <div className="row">
        <div className="col-md-2 bg-light mr-4" style={{ height: "100vh" }}>
          {!isFormOpen && (
            <button onClick={() => setIsFormOpen(true)}>
              Create new strategy
            </button>
          )}
          {isFormOpen && (
            <>
              <StrategyConfig
                onSave={handleSaveStrategy}
                onStrategiesChange={strategiesChange}
              />
              <button
                onClick={() => setIsFormOpen(false)}
                type="button"
                className="btn btn-warning"
              >
                Cancel
              </button>
            </>
          )}
        </div>
        <div className="col-md-8">
          <Table striped bordered hover className="table table-dark">
            <thead className="thead-dark">
              <tr>
                <th>Name</th>
                <th>Indicators</th>
                <th>Buy Conditions</th>
                <th>Sell Conditions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {strategies.map((strategy, index) => (
                <tr key={index}>
                  <td>{strategy.name}</td>
                  <td>
                    {strategy.indicators.map((indicator, index) => (
                      <div key={index}>
                        {indicator.id}: {indicator.value}
                      </div>
                    ))}
                  </td>
                  <td>
                    {strategy.buyConditions.map((con, index) => (
                      <div key={index}>{con}</div>
                    ))}
                  </td>
                  <td>
                    {strategy.sellConditions.map((con, index) => (
                      <div key={index}>{con}</div>
                    ))}
                  </td>
                  <td>
                    <button onClick={() => handleDeleteStrategy(index)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Strategies;
