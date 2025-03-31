'use client';

import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';

const BACKEND_URL = "https://crypto-backend-3gse.onrender.com"; // backend url

export default function Home() {
  // Email states
  const [email, setEmail] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("BTC");
  const [view, setView] = useState("dashboard"); // Initialize view state
  const [sending, setSending] = useState(false);

  // Crypto states
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [chartUrl, setChartUrl] = useState(null);

  const [darkMode, setDarkMode] = useState(false);
  const [threshold, setThreshold] = useState(3);



  // email func to send to backend
  const handleSendEmail = async () => {
    if (!email || !selectedCurrency) {
      alert("Please add your email and your preferred currency");
      return;
    }

    setSending(true);
    try {
      const response = await fetch(`${BACKEND_URL}/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, symbol: selectedCurrency }), // تغییر نام فیلد
      });

      const data = await response.json();
      if (data.status === "success") {
        alert("Email has been sent successfully!");
      } else {
        alert("Error in sending email: " + data.message);
      }
    } catch (error) {
      console.error("Error sending email:", error);
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


  // Fetch email alert settings when email is set
  useEffect(() => {
    if (!email) return;
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/get-settings/${email}`);
        if (!response.ok) throw new Error("Failed to fetch settings");
        const data = await response.json();
        if (data.status === "success") {
          setEmail(data.data.email);
          setSelectedCurrency(data.data.symbol);
        } else {
          console.error("Error fetching settings:", data.message);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();
  }, [email]);

  // Fetch chart image
  useEffect(() => {
    if (!selectedCoin || chartUrl) return;
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

  // Click on coin
  const handleCoinSelect = (coin) => {
    setSelectedCoin(coin);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar setView={setView} />

    
      
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

        {view === "market" && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">📈 Market View</h2>
            <p className="text-gray-600">
              View real-time cryptocurrency prices and compare trends across different exchanges.
            </p>
         </div>
        )}

        {view === "settings" && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">⚙️ Settings</h2>
            <p className="text-gray-600">
              Adjust your preferences, set price alerts, and customize your dashboard experience.
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
        </div>

  

       {/* Market View */}
       {view === "market" && (
            <div>
                <h2 className="text-3xl font-bold mb-4">📈 Market Prices</h2>
                <p className="text-gray-600 mb-4">Here you can view the latest cryptocurrency prices and trends.</p>
            {/* Email Sending Section */}
            <div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">📩 Sending Email </h2>

          <div className="flex flex-col gap-4">
            {/* Email Field */}
            <input
              type="email"
              placeholder="Please enter your email correctly"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 rounded-lg w-full"
            />

            {/* Choose symbol */}
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="border p-2 rounded-lg w-full"
            >
              <option value="BTC">Bitcoin (BTC)</option>
              <option value="ETH">Ethereum (ETH)</option>
              <option value="USDT">Tether (USDT)</option>
            </select>

            {/* Send button */}
            <button
              onClick={handleSendEmail}
              disabled={sending}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              {sending ? "Sending..." : "📨 Email"}
            </button>
          </div>
        </div>
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
              onClick={handleSendEmail}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mt-2"
            >
              Set Alert
            </button>
          </div>
        )}
  
 
        {/* Crypto Prices Section */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
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

        {/* Chart Section */}
        {chartUrl && (
          <div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">📊 Price Trend for {selectedCoin}</h2>
            <img src={chartUrl} alt="Crypto Price Chart" className="w-full max-w-3xl border rounded-lg" />
          </div>
        )}
      </div>
  );
}
