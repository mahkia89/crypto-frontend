import Link from 'next/link';

export default function Sidebar() {
    return (
      <div className="w-64 h-screen bg-gray-800 text-white p-5">
        <h2 className="text-2xl font-bold mb-5">Dashboard</h2>
        <ul>
          <li className="py-2 px-4 hover:bg-gray-700 rounded cursor-pointer">📊 Market</li>
          <li className="py-2 px-4 hover:bg-gray-700 rounded cursor-pointer">⚙️ Settings</li>
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
  