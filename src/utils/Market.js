import { Sector } from "recharts";

const TechnicalIndicators = require("technicalindicators");


export function findEntryPoints(typeConditions, indicators, marketData){
    let result = [];
    for (const signal of typeConditions) {
      const [indicator, operator, indicator2] =
        signal.split(/(<|>|<=|>=)/);
      const ind1 = indicators[indicator];
      const ind2 = indicators[indicator2];
      const res1 = marketData.length - ind1.result.length;

      if (ind1 && ind2) {
        const res2 = marketData.length - ind2.result.length;
        switch (operator) {
          case ">":
            for (let i = marketData.length - 1; i >= 0; i--) {
              if (ind1.result[i - res1] > ind2.result[i - res2]) {
                result.push(marketData[i].time);
              }
            }
            break;
          case ">=":
            for (let i = marketData.length - 1; i >= 0; i--) {
              if (ind1.result[i - res1] >= ind2.result[i - res2]) {
                result.push(marketData[i].time);
              }
            }
            break;
          case "<":
            for (let i = marketData.length - 1; i >= 0; i--) {
              if (ind1.result[i - res1] < ind2.result[i - res2]) {
                result.push(marketData[i].time);
              }
            }
            break;
          case "<=":
            for (let i = marketData.length - 1; i >= 0; i--) {
              if (ind1.result[i - res1] <= ind2.result[i - res2]) {
                result.push(marketData[i].time);
              }
            }
            break;
        }
      }
      if (ind1 && !ind2) {
        switch (operator) {
          case ">":
            for (let i = marketData.length - 1; i >= 0; i--) {
              if (ind1.result[i - res1] > indicator2) {
                result.push(marketData[i].time);
              }
            }
            break;
          case ">=":
            for (let i = marketData.length - 1; i >= 0; i--) {
              if (ind1.result[i - res1] >= indicator2) {
                result.push(marketData[i].time);
              }
            }
            break;
          case "<":
            for (let i = marketData.length - 1; i >= 0; i--) {
              if (ind1.result[i - res1] < indicator2) {
                result.push(marketData[i].time);
              }
            }
            break;
          case "<=":
            for (let i = marketData.length - 1; i >= 0; i--) {
              if (ind1.result[i - res1] <= indicator2) {
                result.push(marketData[i].time);
              }
            }
            break;
        }
      }
    }
    return result;
  }
  export function generateIndicators(indicators, price){
    let indicatorsDict = {};
    for (const indicator of indicators) {
      if (indicator.id === "ma") {
        // Create a moving average indicator with the specified value
        const maIndicator = new TechnicalIndicators.SMA({
          period: indicator.value,
          values: price,
        });
        //maIndicators.push(maIndicator);
        indicatorsDict["ma" + indicator.value] = maIndicator;
      } else if (indicator.id === "rsi") {
        // Create a RSI indicator with the specified value
        const rsiIndicator = new TechnicalIndicators.RSI({
          period: indicator.value,
          values: price,
        });
        indicatorsDict["rsi" + indicator.value] = rsiIndicator;
        //rsiIndicators.push(rsiIndicator);
      } else if (indicator.id === "ema") {
        const emaIndicator = new TechnicalIndicators.EMA({
          period: indicator.value,
          values: price,
        });
        //emaIndicators.push(emaIndicator)
        indicatorsDict["ema" + indicator.value] = emaIndicator;
      }
    }
    return indicatorsDict;
  }

  export const renderActiveShape = (props) => { 
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";
  
    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
        >{`${payload.name}`}</text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#999"
        >
          {`(Rate ${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };
  