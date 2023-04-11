import { useState, useEffect, useRef } from 'react';
import { createChart, CrosshairMode, LineStyle } from 'lightweight-charts';
import axios from 'axios';
import { w3cwebsocket } from 'websocket';
import { Spinner } from 'react-bootstrap';

function ChartComponent({ coin, klinetime}) {
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
        background: { color: '#222' },
        textColor: '#DDD',
        },
      grid: {
        vertLines: { color: '#444' },
        horzLines: { color: '#444' },
     },
    });
    chart.applyOptions({
      crosshair: {
          mode: CrosshairMode.Normal,
          vertLine: {
              width: 8,
              color: '#C3BCDB44',
              style: LineStyle.Solid,
              labelBackgroundColor: '#9B7DFF',
          },
          horzLine: {
              color: '#9B7DFF',
              labelBackgroundColor: '#9B7DFF',
          },
      },
      watermark: {
        visible: true,
        fontSize: 24,
        horzAlign: 'right',
        vertAlign: 'bottom',
        color: 'rgba(171, 71, 188, 0.5)',
        text: 'AlphaTrade',
      },
    });
    candlestickSeriesRef.current = chart.addCandlestickSeries();
    areaSeriesRef.current = chart.addAreaSeries({
      lastValueVisible: false, 
      crosshairMarkerVisible: false, 
      lineColor: 'transparent',
      topColor: 'rgba(56, 33, 110,0.6)',
      bottomColor: 'rgba(56, 33, 110, 0.1)',
    });

    async function fetchData() {
      try {
        const response = await axios.get(`http://localhost:3000/klines/${coin.toUpperCase()}/${klinetime}/1680340440000`);
        const data = response.data
        let transformedData = data.map(obj => ({
          time: (new Date(obj.open_time).getTime() +10800000)/ 1000,
          open: parseFloat(obj.open),
          high: parseFloat(obj.high),
          low: parseFloat(obj.low),
          close: parseFloat(obj.close),
        }));
        candlestickSeriesRef.current.setData(transformedData);
        let lineData = transformedData.map(datapoint => ({
          time: datapoint.time,
          value: (datapoint.close + datapoint.open) / 2,
        }));
        lineData = lineData.map(point => {
          if (point.time !== (1681146120000 + 10800000) / 1000 ){
            return point
          }
          return { ...point, topColor: 'orange', bottomColor:'orange'};
        })
        areaSeriesRef.current.setData(lineData)
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
        candlestickSeriesRef.current.update( kline )
        const areaData = {
          time: kline.time,
          value: (kline.open + kline.close) / 2
        }
        areaSeriesRef.current.update(areaData)
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
