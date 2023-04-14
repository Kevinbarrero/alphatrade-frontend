import { useState, useEffect, useRef } from "react";
import { createChart, CrosshairMode, LineStyle } from "lightweight-charts";
import axios from "axios";
import { w3cwebsocket } from "websocket";
import { Spinner } from "react-bootstrap";
import { findEntryPoints } from "../../utils/FindEntryPoints";
const TechnicalIndicators = require("technicalindicators");

function ChartComponent({ coin, klinetime, onHandleStrategyBacktest, onBacktestDataChange}) {
  const chartContainer = useRef(null);
  const candlestickSeriesRef = useRef(null);
  const areaSeriesRef = useRef(null);
  const socketRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const chart = createChart(chartContainer.current, {
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      priceScale: {
        autoScale: true,
        mode: 2,
        precision: 5,
      },
      layout: {
        background: { color: "#222" },
        textColor: "#DDD",
      },
      grid: {
        vertLines: { color: "#444" },
        horzLines: { color: "#444" },
      },
    });
    chart.applyOptions({
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          width: 8,
          color: "#C3BCDB44",
          style: LineStyle.Solid,
          labelBackgroundColor: "#9B7DFF",
        },
        horzLine: {
          color: "#9B7DFF",
          labelBackgroundColor: "#9B7DFF",
        },
      },
      watermark: {
        visible: true,
        fontSize: 24,
        horzAlign: "right",
        vertAlign: "bottom",
        color: "rgba(171, 71, 188, 0.5)",
        text: "AlphaTrade",
      },
    });
    candlestickSeriesRef.current = chart.addCandlestickSeries();
    areaSeriesRef.current = chart.addAreaSeries({
      lastValueVisible: false,
      crosshairMarkerVisible: false,
      lineColor: "transparent",
      topColor: "rgba(56, 33, 110,0.6)",
      bottomColor: "rgba(56, 33, 110, 0.1)",
    });
    let orders  = {
      short: { open: [], close: [], profit: [] },
      long: { open: [], close: [], profit: [] },
    }


    async function fetchData() {
      try {
        let indicatorsDict = {};
        const response = await axios.get(
          `http://localhost:3000/klines/${coin.toUpperCase()}/${klinetime}/1680340440000`
        );
        const data = response.data;
        let transformedData = data.map((obj) => ({
          time: (new Date(obj.open_time).getTime() + 10800000) / 1000,
          open: parseFloat(obj.open),
          high: parseFloat(obj.high),
          low: parseFloat(obj.low),
          close: parseFloat(obj.close),
        }));
        candlestickSeriesRef.current.setData(transformedData);
        let lineData = transformedData.map((datapoint) => ({
          time: datapoint.time,
          value: (datapoint.close + datapoint.open) / 2,
        }));
        if (onHandleStrategyBacktest) {
          //creating indicators
          let closeprice = transformedData.map((obj) => obj.close);
          for (const indicator of onHandleStrategyBacktest.indicators) {
            if (indicator.id === "ma") {
              // Create a moving average indicator with the specified value
              const maIndicator = new TechnicalIndicators.SMA({
                period: indicator.value,
                values: closeprice,
              });
              //maIndicators.push(maIndicator);
              indicatorsDict["ma" + indicator.value] = maIndicator;
            } else if (indicator.id === "rsi") {
              // Create a RSI indicator with the specified value
              const rsiIndicator = new TechnicalIndicators.RSI({
                period: indicator.value,
                values: closeprice,
              });
              indicatorsDict["rsi" + indicator.value] = rsiIndicator;
              //rsiIndicators.push(rsiIndicator);
            } else if (indicator.id === "ema") {
              const emaIndicator = new TechnicalIndicators.EMA({
                period: indicator.value,
                values: closeprice,
              });
              //emaIndicators.push(emaIndicator)
              indicatorsDict["ema" + indicator.value] = emaIndicator;
            }
          }
          let buyPoints = findEntryPoints(
            onHandleStrategyBacktest.buyConditions,
            indicatorsDict,
            transformedData
          );
          let sellPoints = findEntryPoints(
            onHandleStrategyBacktest.sellConditions,
            indicatorsDict,
            transformedData
          );
          //only unique values for sellpoints and buypoints
          buyPoints = buyPoints.filter(
            (item, index) =>
              buyPoints.indexOf(item) !== index &&
              buyPoints.lastIndexOf(item) === index
          );
          sellPoints = sellPoints.filter(
            (item, index) =>
              sellPoints.indexOf(item) !== index &&
              sellPoints.lastIndexOf(item) === index
          );
          let isShortOrderOpen = false;
          let isLongOrderOpen = false;

          lineData = lineData.map((point) => {
            if (buyPoints.includes(point.time) && !isLongOrderOpen) {
              isShortOrderOpen = false;
              isLongOrderOpen = true;
              if (orders["short"]["open"].length > 0) {
                orders["short"]["close"].push(point.value);
              }
              orders["long"]["open"].push(point.value);
              return {
                ...point,
                topColor: "rgba(39, 223, 13, 0.8)",
                bottomColor: "rgba(39, 223, 13, 0.8)",
              };
            }
            //show sell points
            if (sellPoints.includes(point.time) && !isShortOrderOpen) {
              isShortOrderOpen = true;
              isLongOrderOpen = false;
              orders["short"]["open"].push(point.value);
              if (orders["long"]["open"].length > 0) {
                orders["long"]["close"].push(point.value);
              }
              return {
                ...point,
                topColor: "rgba(223, 13, 13, 0.8)",
                bottomColor: "rgba(223, 13, 13, 0.8)",
              };
            }

            return point;
          });

          for (let i = 0; i < orders["short"]["close"].length; i++) {
            const openPrice = orders["short"]["open"][i];
            const closePrice = orders["short"]["close"][i];
            const percentageDistance =
              ((openPrice - closePrice) / closePrice) * 100;
            orders["short"]["profit"][i] = percentageDistance;
          }

          for (let i = 0; i < orders["long"]["close"].length; i++) {
            const openPrice = orders["long"]["open"][i];
            const closePrice = orders["long"]["close"][i];
            const percentageDistance =
              ((closePrice - openPrice) / openPrice) * 100;
            orders["long"]["profit"][i] = percentageDistance;
          }
          onBacktestDataChange(orders)
        }
        areaSeriesRef.current.setData(lineData);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();

    socketRef.current = new w3cwebsocket(
      `wss://stream.binance.com:9443/ws/${coin.toLowerCase()}@kline_${klinetime}`
    );

    socketRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const candlestick = message.k;
      if (!candlestick.x) {
        const kline = {
          time: (new Date(candlestick.t).getTime() + 10800000) / 1000,
          open: parseFloat(candlestick.o),
          high: parseFloat(candlestick.h),
          low: parseFloat(candlestick.l),
          close: parseFloat(candlestick.c),
        };
        candlestickSeriesRef.current.update(kline);
        const areaData = {
          time: kline.time,
          value: (kline.open + kline.close) / 2,
        };
        areaSeriesRef.current.update(areaData);
      }
    };

    return () => {
      socketRef.current.close();
      chart.removeSeries(candlestickSeriesRef.current);
      chart.remove(candlestickSeriesRef.current);
    };
  }, [coin, klinetime, onHandleStrategyBacktest]);

  return (
    <>
      {isLoading && (
        <div className="d-flex justify-content-center mt-3">
          <Spinner animation="border" variant="primary" />
        </div>
      )}
      <div
        ref={chartContainer}
        style={{ width: "100%", height: "500px" }}
      ></div>
    </>
  );
}

export default ChartComponent;
