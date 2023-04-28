import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { postStrategy } from "../../services/user.service";

function StrategyConfig({ onSave, onStrategiesChange }) {
  const [name, setName] = useState("");
  const [indicators, setIndicators] = useState([]);
  const [buyConditions, setBuyConditions] = useState([]);
  const [sellConditions, setSellConditions] = useState([]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleIndicatorChange = (index, event) => {
    const updatedIndicators = [...indicators];
    updatedIndicators[index][event.target.name] = event.target.value;
    setIndicators(updatedIndicators);
  };

  const handleIndicatorValueChange = (index, event) => {
    const updatedIndicators = [...indicators];
    updatedIndicators[index].value = event.target.value;
    setIndicators(updatedIndicators);
  };

  const handleAddIndicator = () => {
    setIndicators([...indicators, { id: "", value: "" }]);
  };

  const handleRemoveIndicator = (index) => {
    const updatedIndicators = [...indicators];
    updatedIndicators.splice(index, 1);
    setIndicators(updatedIndicators);
  };

  const handleBuyConditionChange = (index, event) => {
    const updatedBuyConditions = [...buyConditions];
    updatedBuyConditions[index] = event.target.value;
    setBuyConditions(updatedBuyConditions);
  };

  const handleAddBuyCondition = () => {
    setBuyConditions([...buyConditions, ""]);
  };

  const handleRemoveBuyCondition = (index) => {
    const updatedBuyConditions = [...buyConditions];
    updatedBuyConditions.splice(index, 1);
    setBuyConditions(updatedBuyConditions);
  };

  const handleSellConditionChange = (index, event) => {
    const updatedSellConditions = [...sellConditions];
    updatedSellConditions[index] = event.target.value;
    setSellConditions(updatedSellConditions);
  };

  const handleAddSellCondition = () => {
    setSellConditions([...sellConditions, ""]);
  };

  const handleRemoveSellCondition = (index) => {
    const updatedSellConditions = [...sellConditions];
    updatedSellConditions.splice(index, 1);
    setSellConditions(updatedSellConditions);
  };

  const handleSave = () => {
    if (!name || !indicators || !buyConditions || !sellConditions) {
      alert("Please fill out all fields");
      console.log(name, indicators, buyConditions, sellConditions);
      return;
    }
    const strategyConfig = {
      name: name,
      indicators: indicators,
      buyConditions: buyConditions,
      sellConditions: sellConditions,
    };

    onSave();
    postStrategy(name, indicators, buyConditions, sellConditions);
    onStrategiesChange(strategyConfig);
  };

  return (
    <div>
      <Form>
        <Form.Group>
          <Form.Label>Strategy Name:</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={handleNameChange}
            style={{ width: "90%" }}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Indicators:</Form.Label>
          {indicators.map((indicator, index) => (
            <div key={index}>
              <Form.Group>
                <Form.Label>Indicator:</Form.Label>
                <Form.Control
                  as="select"
                  name="id"
                  value={indicator.id}
                  onChange={(event) => handleIndicatorChange(index, event)}
                  style={{ width: "90%" }}
                >
                  <option value="">Select an indicator</option>
                  <option value="ma">Moving Average</option>
                  <option value="rsi">Relative Strength Index (RSI)</option>
                  <option value="ema">Exponential Moving Average (EMA)</option>
                  {/* Add more indicators here */}
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Value:</Form.Label>
                <Form.Control
                  type="text"
                  value={indicator.value}
                  onChange={(event) => handleIndicatorValueChange(index, event)}
                  onKeyPress={(event) => {
                    // Only allow numeric characters (0-9) and the period (.) character
                    const regex = /[0-9.]/;
                    if (!regex.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  style={{ width: "90%" }}
                />
              </Form.Group>
              <Button
                variant="danger"
                onClick={() => handleRemoveIndicator(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button variant="primary" onClick={handleAddIndicator}>
            Add Indicator
          </Button>
        </Form.Group>

        <Form.Group>
          <h6>
            {" "}
            please add the conditions with this format: ma70{">"}ma30, or rsi
            {">"}80
          </h6>
          <Form.Label>Buy Conditions:</Form.Label>
          {buyConditions.map((condition, index) => (
            <div key={index}>
              <Form.Group>
                <Form.Label>Buy Condition {index + 1}:</Form.Label>
                <Form.Control
                  type="text"
                  value={condition}
                  onChange={(event) => handleBuyConditionChange(index, event)}
                  style={{ width: "90%" }}
                />
              </Form.Group>
              <Button
                variant="danger"
                onClick={() => handleRemoveBuyCondition(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button variant="primary" onClick={handleAddBuyCondition}>
            Add Buy Condition
          </Button>
        </Form.Group>

        <Form.Group>
          <Form.Label>Sell Conditions:</Form.Label>
          {sellConditions.map((condition, index) => (
            <div key={index}>
              <Form.Group>
                <Form.Label>Sell Condition {index + 1}:</Form.Label>
                <Form.Control
                  type="text"
                  value={condition}
                  onChange={(event) => handleSellConditionChange(index, event)}
                  style={{ width: "90%" }}
                />
              </Form.Group>
              <Button
                variant="danger"
                onClick={() => handleRemoveSellCondition(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button variant="primary" onClick={handleAddSellCondition}>
            Add Sell Condition
          </Button>
        </Form.Group>

        <Button variant="success" onClick={handleSave}>
          Save
        </Button>
      </Form>
    </div>
  );
}
export default StrategyConfig;
