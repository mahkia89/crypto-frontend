'use client';

import { useState, useEffect } from 'react';

export default function Settings() {
  const [alertThreshold, setAlertThreshold] = useState(5); // Default to 5%
  const [darkMode, setDarkMode] = useState(false);

  // Load dark mode preference from local storage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    document.documentElement.classList.toggle('dark', savedDarkMode);
  }, []);

  // Toggle dark mode and save preference
  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  // Save alert threshold
  const handleSaveSettings = async () => {
    try {
      const response = await fetch('https://crypto-backend-3gse.onrender.com/update-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertThreshold })
      });
      const data = await response.json();
      if (data.status === 'success') {
        alert('Settings updated successfully!');
      } else {
        alert('Failed to update settings.');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('An error occurred.');
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Settings</h1>
      
      {/* Email Alert Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">📩 Email Alerts</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-3">Set an alert to receive an email if the selected cryptocurrency drops by more than a certain percentage within one hour.</p>
        <input
          type="number"
          value={alertThreshold}
          onChange={(e) => setAlertThreshold(e.target.value)}
          className="w-full p-2 border rounded-lg text-gray-800 dark:text-white dark:bg-gray-700"
          min="1"
          max="100"
        />
      </div>
      
      {/* Dark Mode Toggle */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">🌙 Dark Mode</h2>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" checked={darkMode} onChange={handleDarkModeToggle} className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 peer-checked:after:translate-x-5"></div>
        </label>
      </div>
      
      {/* Save Button */}
      <button onClick={handleSaveSettings} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
        Save Settings
      </button>
    </div>
  );
}
