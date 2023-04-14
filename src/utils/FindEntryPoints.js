

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