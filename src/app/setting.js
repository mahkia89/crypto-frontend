'use client';

import { useState } from 'react';

export default function Settings() {
  const [alertThreshold, setAlertThreshold] = useState(5); // Default to 5%

  // Save alert threshold
  const handleSaveSettings = async () => {
    try {
      const response = await fetch('https://crypto-backend-3gse.onrender.com/update-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertThreshold }),
      });
      const data = await response.json();
      alert(data.status === 'success' ? 'Settings updated successfully!' : 'Failed to update settings.');
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('An error occurred.');
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Settings</h1>

      {/* Email Alert Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">📩 Email Alerts</h2>
        <p className="text-gray-600 mb-3">
          Set an alert to receive an email if the selected cryptocurrency drops by more than a certain percentage within one hour.
        </p>
        <input
          type="number"
          value={alertThreshold}
          onChange={(e) => setAlertThreshold(e.target.value)}
          className="w-full p-2 border rounded-lg text-gray-800"
          min="1"
          max="100"
        />
      </div>

      {/* Save Button */}
      <button
        onClick={handleSaveSettings}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Save Settings
      </button>
    </div>
  );
}
