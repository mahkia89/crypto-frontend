'use client';

import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';

const BACKEND_URL = "https://crypto-backend-3gse.onrender.com"; // backend url

export default function Home() {
  // Toggle state for dashboard views
  const [view, setView] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);

  // Email alert states
  const [email, setEmail] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("BTC");
  const [threshold, setThreshold] = useState(3); // Default 3%
  const [sending, setSending] = useState(false);
  const [imageEmail, setImageEmail] = useState("");

  // Crypto states
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch crypto prices
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/stored-prices`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const jsonData = await response.json();

        if (jsonData.status === "success") {
          setCryptos(jsonData.data.slice(0, 3)); // Show 3 top coins
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

  return (
    <div className={`flex min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      {/* Sidebar */}
      <Sidebar 
        onMarketClick={() => setView("market")} 
        onSettingsClick={() => setView("settings")} 
      />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-4xl font-bold mb-6">Crypto Dashboard</h1>

        {view !== "dashboard" && (
          <button
            onClick={() => setView("dashboard")}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-6"
          >
            Back to Dashboard
          </button>
        )}

        {/* Market View */}
        {view === "market" && (
          <div>
            <h2 className="text-3xl font-bold mb-4">📈 Market Prices</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <ul>
                {cryptos.map((coin, index) => (
                  <li key={index} className="mb-2">
                    {coin.symbol}: ${coin.price.toFixed(2)}
                  </li>
                ))}
              </ul>
            )}
            <input
              type="email"
              placeholder="Enter email to receive images"
              value={imageEmail}
              onChange={(e) => setImageEmail(e.target.value)}
              className="border p-2 rounded-lg w-full mt-4"
            />
            <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mt-2">
              Send Images to Email
            </button>
          </div>
        )}

        {/* Settings View */}
        {view === "settings" && (
          <div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-4">⚙️ Settings</h2>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
                className="mr-2"
              />
              Dark Mode
            </label>
            <h3 className="text-2xl font-semibold mt-6">📩 Set Email Alert</h3>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 rounded-lg w-full mt-2"
            />
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="border p-2 rounded-lg w-full mt-2"
            >
              <option value="BTC">Bitcoin (BTC)</option>
              <option value="ETH">Ethereum (ETH)</option>
              <option value="USDT">Tether (USDT)</option>
            </select>
            <select
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="border p-2 rounded-lg w-full mt-2"
            >
              <option value={3}>Alert me if price drops more than 3%</option>
              <option value={5}>Alert me if price drops more than 5%</option>
            </select>
            <button
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mt-2"
            >
              Set Alert
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
