import Link from 'next/link';

export default function Sidebar({ onMarketClick, onSettingsClick }) {
    return (
      <div className="w-64 h-screen bg-gray-800 text-white p-5">
        <h2 className="text-2xl font-bold mb-5">Dashboard</h2>
        <ul>
          <li>
            <button 
              onClick={onMarketClick} 
              className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded cursor-pointer text-left"
            >
              📊 Market
            </button>
          </li>
          <li className="mt-2">
            <button 
              onClick={onSettingsClick} 
              className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded cursor-pointer text-left"
            >
              ⚙️ Settings
            </button>
          </li>
        </ul>
        <div className="mt-5">
          <Link href="/charts">
            <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              📊 View Charts
            </button>
          </Link>
        </div>
      </div>
    );
}
