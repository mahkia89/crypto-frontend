'use client';

import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';

const BACKEND_URL = "https://crypto-backend-3gse.onrender.com"; // backend url

export default function Home() {
  // Toggle state for dashboard and settings page
  const [showSettings, setShowSettings] = useState(false);

  // Email alert states
  const [email, setEmail] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("BTC");
  const [threshold, setThreshold] = useState(3); // Default 3%
  const [sending, setSending] = useState(false);

  // Crypto states
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [chartUrl, setChartUrl] = useState(null);

  // Send email alert setup to backend
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
          const formattedData = jsonData.data.reduce((acc, item) => {
            if (!acc[item.symbol]) acc[item.symbol] = [];
            acc[item.symbol].push({
              price: item.price,
              source: item.source,
              timestamp: item.timestamp,
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

  // Fetch chart image
  useEffect(() => {
    const fetchChart = async () => {
      if (!selectedCoin) return;

      try {
        const chartResponse = await fetch(`${BACKEND_URL}/chart-image/${selectedCoin}`);
        if (!chartResponse.ok) {
          throw new Error("Failed to fetch chart");
        }
        const blob = await chartResponse.blob();
        setChartUrl(URL.createObjectURL(blob));
      } catch (error) {
        console.error("Error fetching chart:", error);
      }
    };

    fetchChart();
  }, [selectedCoin]);

  // Select coin
  const handleCoinSelect = (coin) => {
    setSelectedCoin(coin);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-100">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Crypto Dashboard</h1>

        {/* Toggle Button */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-6"
        >
          {showSettings ? "Back to Dashboard" : "Go to Settings"}
        </button>

        {/* If showSettings is false, display the main dashboard */}
        {!showSettings ? (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome to the Crypto Dashboard!</h2>
            <p className="text-gray-600">
              Here you can view the latest cryptocurrency prices and trends. Check out the performance of Bitcoin, Ethereum, and more!
            </p>
            {/* Add more descriptive content about your dashboard here */}
          </div>
        ) : (
          // If showSettings is true, display the settings page
          <div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">📩 Set Email Alert </h2>

            <div className="flex flex-col gap-4">
              {/* Email Input */}
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2 rounded-lg w-full"
              />

              {/* Choose Currency */}
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="border p-2 rounded-lg w-full"
              >
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="ETH">Ethereum (ETH)</option>
                <option value="USDT">Tether (USDT)</option>
              </select>

              {/* Alert Threshold */}
              <select
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="border p-2 rounded-lg w-full"
              >
                <option value={3}>Alert me if price drops more than 3%</option>
                <option value={5}>Alert me if price drops more than 5%</option>
              </select>

              {/* Send Alert Button */}
              <button
                onClick={handleSendEmail}
                disabled={sending}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              >
                {sending ? "Sending..." : "📨 Set Alert"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
