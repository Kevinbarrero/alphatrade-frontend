import { useState, useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';
import axios from 'axios';
import { w3cwebsocket } from 'websocket';
import { Spinner } from 'react-bootstrap';

function ChartComponent({ coin, klinetime }) {
  const chartContainer = useRef(null);
  const candlestickSeriesRef = useRef(null);
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
    });
    candlestickSeriesRef.current = chart.addCandlestickSeries();

    async function fetchData() {
      try {
        const response = await axios.get(`http://92.63.105.48:3000/klines/${coin.toUpperCase()}/${klinetime}/1679486400000`);
        const data = response.data
        const transformedData = data.map(obj => ({
          time: (new Date(obj.open_time).getTime() +10800000)/ 1000,
          open: parseFloat(obj.open),
          high: parseFloat(obj.high),
          low: parseFloat(obj.low),
          close: parseFloat(obj.close),
        }));
        candlestickSeriesRef.current.setData(transformedData);
        console.log(transformedData)
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();

    socketRef.current = new w3cwebsocket(`wss://stream.binance.com:9443/ws/${coin.toLowerCase()}@kline_${klinetime}`);

    socketRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const candlestick = message.k;
      if (!candlestick.x) {
        candlestickSeriesRef.current.update({
          time: (new Date(candlestick.t).getTime() + 10800000) / 1000,
          open: parseFloat(candlestick.o),
          high: parseFloat(candlestick.h),
          low: parseFloat(candlestick.l),
          close: parseFloat(candlestick.c),
        })
      }

    };

    return () => {
      socketRef.current.close();
      chart.removeSeries(candlestickSeriesRef.current);
      chart.remove(candlestickSeriesRef.current)
    };
  }, [coin, klinetime]);

  return (
    <>
      {isLoading && 
        <div className="d-flex justify-content-center mt-3">
          <Spinner animation="border" variant="primary" />
        </div>
      }
      <div ref={chartContainer} style={{ width: '100%', height: '500px' }}></div>
    </>
  );
}

export default ChartComponent;
