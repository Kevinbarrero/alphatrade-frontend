import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { postStrategy } from "../../services/user.service";

function StrategyConfig({ onSave, onStrategiesChange }) {
  const [name, setName] = useState("");
  const [ind1, setInd1] = useState("");
  const [ind2, setInd2] = useState("");
  const [cond, setCond] = useState("");
  const [tempIndex, setTempIndex] = useState(null);
  const [indicators, setIndicators] = useState([]);
  const [buyConditions, setBuyConditions] = useState([]);
  const [sellConditions, setSellConditions] = useState([]);
  const [conditionType, setConditionType] = useState();

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleIndicatorChange = (index, event) => {
    const updatedIndicators = [...indicators];
    updatedIndicators[index][event.target.name] = event.target.value;
    setIndicators(updatedIndicators);
    // console.log(updatedIndicators);
    // setAllConditions()
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
  const handleInd1Change = (event) => {
    setInd1(event.target.value);
  };
  const handleInd2Change = (event) => {
    setInd2(event.target.value);
  };
  const handleCondChange = (event) => {
    setCond(event.target.value);
  };
  const handleBuyConditionChange = (index, ind1, cond, ind2) => {
    const updatedBuyConditions = [...buyConditions];
    const conditionString = ind1 + cond + ind2;

    updatedBuyConditions[index] = conditionString;
    console.log(updatedBuyConditions);
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
  useEffect(() => {
    if (conditionType === "Buy") {
      const updatedBuyConditions = [...buyConditions];
      const conditionString = ind1 + cond + ind2;
      updatedBuyConditions[tempIndex] = conditionString;
      setBuyConditions(updatedBuyConditions);
    }
    if (conditionType === "Sell") {
      const updatedSellConditions = [...sellConditions];
      const conditionString = ind1 + cond + ind2;
      updatedSellConditions[tempIndex] = conditionString;
      setSellConditions(updatedSellConditions);
    }
  }, [ind1, cond, ind2, tempIndex, conditionType]);

  const handleSave = () => {
    if (!name || !indicators || !buyConditions || !sellConditions) {
      alert("Please fill out all fields");
      // console.log(name, indicators, buyConditions, sellConditions);
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
                  id = "remove-strat-but"
                variant="danger"
                onClick={() => handleRemoveIndicator(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button id="add-ind-but" variant="primary" onClick={handleAddIndicator}>
            Add Indicator
          </Button>
        </Form.Group>

        <Form.Group>
          <Form.Label>Buy Conditions:</Form.Label>
          {buyConditions.map((condition, index) => (
            <div key={index}>
              <Form.Group onChange={() => setConditionType("Buy")}>
                <Form.Label>Buy Condition {index + 1}:</Form.Label>
                <Form.Group onChange={() => setTempIndex(index)}>
                  <Form.Label>Indicator:</Form.Label>
                  <Form.Control
                    as="select"
                    name="ind1"
                    onChange={(event) => handleInd1Change(event)}
                  >
                    <option value="">Select The First Indicator</option>
                    {indicators.map((indicator, index) => (
                      <option
                        key={indicator.id}
                        value={
                          indicator.id !== ""
                            ? indicator.id + indicator.value
                            : ""
                        }
                      >
                        {indicator.id} {indicator.value}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control
                    as="select"
                    name="cond"
                    onChange={(event) => handleCondChange(event)}
                  >
                    <option value="">Select The Condition</option>
                    <option value=">">Greater Than</option>
                    <option value=">=">Greater Than Or Equal</option>
                    <option value="<">Less Than</option>
                    <option value="<=">Less Than Or Equal</option>
                  </Form.Control>
                  <Form.Control
                    as="select"
                    name="ind2"
                    onChange={(event) => handleInd2Change(event)}
                  >
                    <option value="">Select The Second Indicator</option>
                    {indicators.map((indicator, index) => (
                      <option
                        key={indicator.id}
                        value={
                          indicator.id !== ""
                            ? indicator.id + indicator.value
                            : ""
                        }
                      >
                        {indicator.id} {indicator.value}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Form.Group>
              <Button
                variant="danger"
                onClick={() => handleRemoveBuyCondition(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button id="add-ind-but" variant="primary" onClick={handleAddBuyCondition}>
            Add Buy Condition
          </Button>
        </Form.Group>

        <Form.Group>
          <Form.Label>Sell Conditions:</Form.Label>
          {sellConditions.map((condition, index) => (
            <div key={index}>
              <Form.Group onChange={() => setConditionType("Sell")}>
                <Form.Label>Buy Condition {index + 1}:</Form.Label>
                <Form.Group onChange={() => setTempIndex(index)}>
                  <Form.Label>Indicator:</Form.Label>
                  <Form.Control
                    as="select"
                    name="ind1"
                    onChange={(event) => handleInd1Change(event)}
                  >
                    <option value="">Select The First Indicator</option>
                    {indicators.map((indicator, index) => (
                      <option
                        key={indicator.id}
                        value={
                          indicator.id !== ""
                            ? indicator.id + indicator.value
                            : ""
                        }
                      >
                        {indicator.id} {indicator.value}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control
                    as="select"
                    name="cond"
                    onChange={(event) => handleCondChange(event)}
                  >
                    <option value="">Select The Condition</option>
                    <option value=">">Greater Than</option>
                    <option value=">=">Greater Than Or Equal</option>
                    <option value="<">Less Than</option>
                    <option value="<=">Less Than Or Equal</option>
                  </Form.Control>
                  <Form.Control
                    as="select"
                    name="ind2"
                    onChange={(event) => handleInd2Change(event)}
                  >
                    <option value="">Select The Second Indicator</option>
                    {indicators.map((indicator, index) => (
                      <option
                        key={indicator.id}
                        value={
                          indicator.id !== ""
                            ? indicator.id + indicator.value
                            : ""
                        }
                      >
                        {indicator.id} {indicator.value}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Form.Group>
              <Button
                  id="remove-strat-but"
                variant="danger"
                onClick={() => handleRemoveSellCondition(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button id="add-ind-but" variant="primary" onClick={handleAddSellCondition}>
            Add Sell Condition
          </Button>
        </Form.Group>

        <Button id="strat-save-button" variant="success" onClick={handleSave}>
          Save
        </Button>
      </Form>
    </div>
  );
}
export default StrategyConfig;
