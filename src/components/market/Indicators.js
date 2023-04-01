import React from 'react';
import { createChart } from 'lightweight-charts';

class IndicatorComponent extends React.Component {
  constructor(props) {
    super(props);
    this.chart = null;
  }

  componentDidMount() {
    const chart = createChart(this.container, { width: 400, height: 300 });
    this.chart = chart;
  }

  createIndicator = (indicatorType, options) => {
    if (!this.chart) return;
    const indicator = this.chart.addIndicator(indicatorType, options);
    return indicator;
  };

  setIndicator = (indicator, options) => {
    if (!this.chart || !indicator) return;
    indicator.applyOptions(options);
  };

  render() {
    return <div ref={el => (this.container = el)} />;
  }
}

export default IndicatorComponent;