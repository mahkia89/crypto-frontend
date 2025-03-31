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
  const [selectedMarketCurrency, setSelectedMarketCurrency] = useState("BTC");

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

  // Send email alert
  const handleSendEmail = async () => {
    if (!email || !selectedCurrency) {
      alert("Please enter your email and select a currency");
      return;
    }

    setSending(true);
    try {
      const response = await fetch(`${BACKEND_URL}/set-email-alert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, symbol: selectedCurrency, threshold }),
      });

      const data = await response.json();
      if (data.status === "success") {
        alert("Email alert has been set successfully!");
      } else {
        alert("Error setting email alert: " + data.message);
      }
    } catch (error) {
      console.error("Error setting email alert:", error);
      alert("An error occurred");
    } finally {
      setSending(false);
    }
  };

  // Send market image email
  const handleSendMarketEmail = async () => {
    if (!imageEmail || !selectedMarketCurrency) {
      alert("Please enter your email and select a currency");
      return;
    }
    
    try {
      const response = await fetch(`${BACKEND_URL}/send-chart-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: imageEmail, symbol: selectedMarketCurrency }),
      });
      
      const data = await response.json();
      if (data.status === "success") {
        alert("Image has been sent to your email!");
      } else {
        alert("Error sending image: " + data.message);
      }
    } catch (error) {
      console.error("Error sending image:", error);
      alert("An error occurred");
    }
  };

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

        {view === "dashboard" && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome to the Crypto Dashboard!</h2>
            <p className="text-gray-600">
              Here you can view the latest cryptocurrency prices and trends. Check out the performance of Bitcoin, Ethereum, and more!
            </p>
          </div>
        )}

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
            <select
              value={selectedMarketCurrency}
              onChange={(e) => setSelectedMarketCurrency(e.target.value)}
              className="border p-2 rounded-lg w-full mt-2"
            >
              <option value="BTC">Bitcoin (BTC)</option>
              <option value="ETH">Ethereum (ETH)</option>
              <option value="USDT">Tether (USDT)</option>
            </select>
            <input
              type="email"
              placeholder="Enter email to receive images"
              value={imageEmail}
              onChange={(e) => setImageEmail(e.target.value)}
              className="border p-2 rounded-lg w-full mt-4"
            />
            <button onClick={handleSendMarketEmail} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mt-2">
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
            <button onClick={handleSendEmail} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mt-2">
              Set Alert
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
