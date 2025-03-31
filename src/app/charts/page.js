'use client';

import { useState, useEffect } from 'react';

export default function Charts() {
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [chartUrl, setChartUrl] = useState(null);
  const BACKEND_URL = "https://crypto-backend-3gse.onrender.com";
  const coins = ['BTC', 'ETH', 'DOGE'];

  useEffect(() => {
    if (!selectedCoin) return;

    console.log("Fetching chart for:", selectedCoin); // Debugging log

    fetch(`${BACKEND_URL}/chart-image/${selectedCoin}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch chart: ${response.status}`);
        }
        return response.blob();
      })
      .then(blob => {
        console.log("Fetched chart successfully"); // Debugging log
        setChartUrl(URL.createObjectURL(blob));
      })
      .catch(error => console.error("Error fetching chart:", error));
  }, [selectedCoin]);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Select a Coin</h1>

      {/* دکمه‌های انتخاب کوین */}
      <div className="flex space-x-4 mb-5">
        {coins.map((coin) => (
          <button
            key={coin}
            className={`py-2 px-4 rounded ${
              selectedCoin === coin ? 'bg-blue-700' : 'bg-gray-500'
            } text-white`}
            onClick={() => setSelectedCoin(coin)}
          >
            {coin}
          </button>
        ))}
      </div>

      {/* نمایش نمودار مربوط به کوین انتخاب شده */}
      {selectedCoin && chartUrl && (
        <div>
          <h2 className="text-xl font-bold mb-3">{selectedCoin} Chart</h2>
          <img
            src={chartUrl}
            alt={`${selectedCoin} Chart`}
            className="border rounded shadow-lg"
          />
        </div>
      )}
    </div>
  );
}
