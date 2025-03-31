'use client';
import { useState, useEffect } from 'react';

export default function Charts() {
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [chartUrl, setChartUrl] = useState(null);
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const BACKEND_URL = "https://crypto-backend-3gse.onrender.com"; // Your backend URL
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

  const handleSendEmail = async () => {
    if (!email || !selectedCoin) return;

    setIsSending(true);
    try {
      const response = await fetch(`${BACKEND_URL}/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, symbol: selectedCoin })
      });

      if (!response.ok) {
        throw new Error(`Failed to send email: ${response.status}`);
      }

      alert("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email.");
    } finally {
      setIsSending(false);
    }
  };

  const handleSetEmailAlert = async () => {
    if (!email || !selectedCoin) {
      alert("Please enter your email and select a coin");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/save-settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          symbol: selectedCoin,
          price_drop_threshold: 3, // Set your price drop threshold here
          dark_mode: false, // If you want to include dark mode
        })
      });

      const data = await response.json();
      if (data.status === "success") {
        alert("Settings saved successfully!");
      } else {
        alert("Error saving settings: " + data.message);
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("An error occurred");
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Select a Coin</h1>

      {/* Coin selection buttons */}
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

      {/* Display chart for selected coin */}
      {selectedCoin && chartUrl && (
        <div>
          <h2 className="text-xl font-bold mb-3">{selectedCoin} Chart</h2>
          <img
            src={chartUrl}
            alt={`${selectedCoin} Chart`}
            className="border rounded shadow-lg mb-4"
          />
          <div className="flex flex-col space-y-3">
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 border rounded"
            />
            <button
              onClick={handleSendEmail}
              className="py-2 px-4 bg-green-600 text-white rounded disabled:opacity-50"
              disabled={isSending}
            >
              {isSending ? "Sending..." : "Send Chart via Email"}
            </button>
            <button
              onClick={handleSetEmailAlert}
              className="py-2 px-4 bg-blue-600 text-white rounded"
            >
              Set Email Alert
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
