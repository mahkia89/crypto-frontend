'use client';

import { useState } from 'react';

export default function Charts() {
  const [selectedCoin, setSelectedCoin] = useState(null);
  const coins = ['BTC', 'ETH', 'DOGE'];

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
      {selectedCoin && (
        <div>
          <h2 className="text-xl font-bold mb-3">{selectedCoin } Chart</h2>
          <img
            src={`http://127.0.0.1:8000/chart-image/${selectedCoin}?symbol=${selectedCoin}`}
            alt={`${selectedCoin} Chart`}
            className="border rounded shadow-lg"
          />
        </div>
      )}
    </div>
  );
}
