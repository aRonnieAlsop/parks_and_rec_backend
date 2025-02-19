import sqlite3 from "sqlite3";
import dotenv from "dotenv";

dotenv.config();

const dbPath = process.env.DATABASE_PATH || "./rec.db";

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error connecting to SQLite:", err.message);
  } else {
    console.log("✅ Connected to SQLite database.");
  }
});

export default db;
