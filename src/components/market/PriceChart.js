import { useState, useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';
import axios from 'axios';
import { w3cwebsocket } from 'websocket';
import { Spinner } from 'react-bootstrap';

function ChartComponent({ coin, klinetime }) {
  const chartContainer = useRef(null);
  const candlestickSeriesRef = useRef(null);
  const smaSeriesRef = useRef(null);
  const socketRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const smaPeriod = 20;
  const [transformedData, setTransformedData] = useState([{ time: 0, open: 0, high: 0, low: 0, close: 0 }])
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
    smaSeriesRef.current = chart.addLineSeries({
      color: '#FFA500',
    lineWidth: 2,
    });

    async function fetchData() {
      try {
        const response = await axios.get(`http://localhost:3000/klines/${coin.toUpperCase()}/${klinetime}/1680340440000`);
        const data = response.data
        const transformedData = data.map(obj => ({
          time: (new Date(obj.open_time).getTime() +10800000)/ 1000,
          open: parseFloat(obj.open),
          high: parseFloat(obj.high),
          low: parseFloat(obj.low),
          close: parseFloat(obj.close),
        }));
        setTransformedData(transformedData)
        candlestickSeriesRef.current.setData(transformedData);

        
        const smaData = [];
        for (let i = 0; i < transformedData.length; i++) {
          if (i < smaPeriod - 1) {
            continue;
          }

          const sum = transformedData.slice(i - smaPeriod + 1, i + 1).reduce((acc, obj) => acc + obj.close, 0);
          const average = sum / smaPeriod;

          smaData.push({
            time: transformedData[i].time,
            value: average,
          });

        }
        smaSeriesRef.current.setData(smaData);

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
        const kline =  {
          time: (new Date(candlestick.t).getTime() + 10800000) / 1000,
          open: parseFloat(candlestick.o),
          high: parseFloat(candlestick.h),
          low: parseFloat(candlestick.l),
          close: parseFloat(candlestick.c),
        }
        setTransformedData([...transformedData, kline,])
        candlestickSeriesRef.current.update( kline )
        const lastDataIndex = transformedData.length - 1;
        const lastData = transformedData[lastDataIndex];
        const newData = {
          time: (new Date(candlestick.t).getTime() + 10800000) / 1000,
          value: lastData.value + (parseFloat(candlestick.c) - parseFloat(lastData.close)) / smaPeriod,
        };
        smaSeriesRef.current.update(newData);
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
