Sure! Below is the modified README for the **frontend** project, with the additional sections and the backend link included:

---

# Crypto Dashboard - Frontend

📊 **Crypto Dashboard - Frontend** is the user interface for the Crypto Price Tracker application, built with React and Next.js. It allows users to view live cryptocurrency prices, track their portfolio, generate price charts, and set up price alerts.

## 🚀 Features

- Displays **live cryptocurrency prices** with real-time updates.
- Visualizes **historical price charts** of cryptocurrencies.
- Provides **user settings** for configuring price alerts and other preferences.
- Enables users to track **multiple cryptocurrencies** in their portfolio.
- **Dark mode** support for improved user experience.
- Fully responsive for mobile and desktop devices.

## 🛠 Tech Stack

- **React**: For building the UI components.
- **Next.js**: For server-side rendering and routing.
- **TailwindCSS**: For styling and layout.
- **Axios**: For making HTTP requests to the backend API.
- **Chart.js**: For generating cryptocurrency price charts.
- **JWT (JSON Web Token)**: For user authentication.

## 📂 Project Structure

```bash
crypto-frontend/
│── components/
│   ├── Sidebar.js           # Navigation bar component      
│── page.js                  # Home page with crypto prices            
│── settings.js              # User settings page for alerts
│── api/cryptos/
│   ├── routes.js            # API functions to communicate with the backend
│── charts/
│   ├── pages.js             # getting historical chart from backend
│── globals.css              # Global styles (TailwindCSS configuration)
│── layout.js                # layout
│── favicon.ico
│── .env.local               # Environment variables (API URL, JWT tokens)
│── README.md                # Project documentation
```

## 📝 Overview

This is the **frontend** for the Crypto Price Tracker app, designed to interact with the backend service built with **FastAPI**. It fetches real-time cryptocurrency data, displays it on a clean interface, and allows users to configure price alerts, track prices, and view historical data in a chart format. The app uses **Next.js** for server-side rendering, ensuring fast page loads and SEO optimization.

## 🛠 Setup & Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/mahkia89/crypto-frontend.git
cd crypto-frontend
```

### 2️⃣ Install Dependencies

Install the required dependencies using npm:

```bash
npm install
```

### 3️⃣ Configure Environment Variables

You need to configure the environment variables for the frontend to connect to your backend. Create a `.env.local` file in the root directory and add the following:

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000  # Replace with your backend URL if not local
```

### 4️⃣ Run the Application

To start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

### 5️⃣ Build for Production

To create a production build:

```bash
npm run build
npm run start
```

The production version of the app will be served at `http://localhost:3000`.

## 🌐 Backend Service

The **backend** service for this project is built with **FastAPI** and uses a **PostgreSQL** database to store data. The backend handles all the business logic such as fetching real-time cryptocurrency prices, generating price charts, and sending email alerts for price thresholds. 

You can find the **backend repository** here: [Crypto Price Tracker - Backend](https://github.com/mahkia89/crypto-backend). 

Make sure to configure the environment variables on the backend (e.g., database URL, email settings) to ensure smooth operation with the frontend.

## 📧 Email Notifications

The frontend provides users with the ability to configure price alerts. When a price threshold is crossed, the backend sends an email notification. Make sure the backend is correctly configured to handle email sending.

## 🌐 Frontend and Backend Communication

The frontend communicates with the backend API (FastAPI) to fetch real-time cryptocurrency data and submit user settings for alerts. Ensure the backend is running properly for the frontend to fetch and display data correctly.

## 🔧 API Endpoints Used in Frontend

- **GET `/stored-prices`**: Fetch the latest cryptocurrency prices from the backend.
- **POST `/send-email`**: Sends an email notification for a price alert.
- **GET `/chart-image/{coin}`**: Fetches a dynamically generated price chart image for the selected cryptocurrency.

## 🖥 Demo

To see a live version of the application, visit our deployed site: [Crypto Price Tracker](https://crypto-frontend-lbkz.onrender.com/).

## 📄 License

This project is licensed under the **MIT License**. 

## 🤝 Contributing

Pull requests are welcome! If you want to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m "Added feature X"`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a pull request.

## 📧 Contact

For any issues or feature requests, reach out via [mahkiagolbashi@gmail.com](mailto:mahkiagolbashi@gmail.com).
