import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { connectWebSocket } from '../webSocket';

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Title, Tooltip, Legend);

const CRYPTO_OPTIONS = [
  { label: 'ETH/USDT', value: 'ethusdt' },
  { label: 'BNB/USDT', value: 'bnbusdt' },
  { label: 'DOT/USDT', value: 'dotusdt' }
];

const INTERVAL_OPTIONS = [
  { label: '1 Minute', value: '1m' },
  { label: '3 Minutes', value: '3m' },
  { label: '5 Minutes', value: '5m' }
];

const App = () => {
  const [selectedSymbol, setSelectedSymbol] = useState(CRYPTO_OPTIONS[0].value);
  const [selectedInterval, setSelectedInterval] = useState(INTERVAL_OPTIONS[0].value);
  const [chartData, setChartData] = useState([]);
  const chartDataRef = useRef({});
  const wsRef = useRef(null);

  useEffect(() => {
    const savedData = localStorage.getItem(selectedSymbol);
    if (savedData) {
      chartDataRef.current[selectedSymbol] = JSON.parse(savedData);
      setChartData(chartDataRef.current[selectedSymbol]);
    } else {
      setChartData([]);
    }

    wsRef.current = connectWebSocket(selectedSymbol, selectedInterval, handleWebSocketData);

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [selectedSymbol, selectedInterval]);

  const handleWebSocketData = (data) => {
    if (data.k) {
      const kline = data.k;
      const candlestickData = {
        x: new Date(kline.t),
        y: [kline.o, kline.h, kline.l, kline.c]
      };

      chartDataRef.current[selectedSymbol] = [
        ...(chartDataRef.current[selectedSymbol] || []),
        candlestickData
      ];
      setChartData([...chartDataRef.current[selectedSymbol]]);
      localStorage.setItem(selectedSymbol, JSON.stringify(chartDataRef.current[selectedSymbol]));
    }
  };

  return (
    <div>
      <h1>Binance Market Data</h1>
      <div>
        <label>Select Cryptocurrency: </label>
        <select onChange={(e) => setSelectedSymbol(e.target.value)} value={selectedSymbol}>
          {CRYPTO_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <label>Select Interval: </label>
        <select onChange={(e) => setSelectedInterval(e.target.value)} value={selectedInterval}>
          {INTERVAL_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Line
          data={{
            datasets: [{
              label: `${selectedSymbol.toUpperCase()} Price Data`,
              data: chartData.map(data => ({
                x: data.x,
                y: data.y
              })),
              backgroundColor: 'rgba(75,192,192,0.2)',
              borderColor: 'rgba(75,192,192,1)',
              borderWidth: 1,
              pointRadius: 0,
              lineTension: 0
            }]
          }}
          options={{
            scales: {
              x: {
                type: 'time',
                time: {
                  unit: 'minute'
                }
              },
              y: {
                beginAtZero: false
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default App;
