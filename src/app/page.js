'use client';

import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';

const BACKEND_URL = "https://crypto-backend-3gse.onrender.com"; // backend url

export default function Home() {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [chartUrl, setChartUrl] = useState(null);

  // get price from fastapi
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/stored-prices`); // data from fastapi
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();

        if (jsonData.status === "success") {
         
          const formattedData = jsonData.data.reduce((acc, item) => {
            if (!acc[item.symbol]) acc[item.symbol] = [];
            acc[item.symbol].push({
              price: item.price,
              source: item.source,
              timestamp: item.timestamp
            });
            return acc;
          }, {});

          setCryptos(formattedData);
        } else {
          console.error("Error fetching data:", jsonData.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  // get chart image from fastapi
  useEffect(() => {
    const fetchChart = async () => {
      if (!selectedCoin) return;

      try {
        const chartResponse = await fetch(`${BACKEND_URL}/chart-image/${selectedCoin}`);
        if (!chartResponse.ok) {
          throw new Error("Failed to fetch chart");
        }
        const blob = await chartResponse.blob();
        setChartUrl(URL.createObjectURL(blob)); // chart img
      } catch (error) {
        console.error("Error fetching chart:", error);
      }
    };

    fetchChart();
  }, [selectedCoin]);

  // Click on coin
  const handleCoinSelect = (coin) => {
    setSelectedCoin(coin);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-8 bg-gray-100">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Crypto Dashboard</h1>

        {loading ? (
          <p className="text-center text-xl text-gray-600">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.keys(cryptos).map((crypto) => (
              <div key={crypto} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
                <h2 className="text-2xl font-semibold text-gray-800">{crypto}</h2>
                {cryptos[crypto].map((data, index) => (
                  <div key={index} className="text-gray-700 mt-4">
                    <p>💰 Price: ${data.price}</p>
                    <p>📡 Source: {data.source}</p>
                    <p>⏳ Timestamp: {data.timestamp}</p>
                  </div>
                ))}
                <button
                  onClick={() => handleCoinSelect(crypto)}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  View Chart for {crypto}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Chart */}
        {chartUrl && (
          <div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">📊 Price Trend for {selectedCoin}</h2>
            <img src={chartUrl} alt="Crypto Price Chart" className="w-full max-w-3xl border rounded-lg" />
          </div>
        )}
      </div>
    </div>
  );
}
