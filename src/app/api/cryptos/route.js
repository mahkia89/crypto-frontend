import sqlite3 from 'sqlite3';
import path from 'path';
import { NextResponse } from 'next/server';

const databasePath = path.resolve('/opt/render/project/src/crypto_prices.db');

export async function GET() {
  try {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(databasePath, sqlite3.OPEN_READONLY, (err) => {
        if (err) {
          console.error("Error opening database:", err);
          resolve(NextResponse.json({ error: "Database connection failed" }, { status: 500 }));
          return;
        }
      });

      db.all('SELECT * FROM prices ORDER BY timestamp DESC LIMIT 50', (err, rows) => {
        if (err) {
          console.error("Error fetching rows:", err);
          resolve(NextResponse.json({ error: "Query execution failed" }, { status: 500 }));
          return;
        }

        if (!rows || rows.length === 0) {
          resolve(NextResponse.json({ message: "No data found in database" }, { status: 404 }));
          return;
        }

        const structuredData = rows.reduce((acc, row) => {
          const symbol = row.symbol.split('-').pop().toUpperCase();
          if (!acc[symbol]) {
            acc[symbol] = [];
          }
          acc[symbol].push({
            price: row.price,
            source: row.source,
            timestamp: row.timestamp,
          });
          return acc;
        }, {});

        resolve(NextResponse.json(structuredData, { status: 200 }));
      });

      db.close();
    });
  } catch (error) {
    console.error("Unhandled Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
