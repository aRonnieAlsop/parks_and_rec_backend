import express from "express";
import cors from "cors";
import db from "./db.js"; 

const app = express();
const PORT = process.env.PORT || 5000;

// allowed origins (frontends):
const allowedOrigins = [
  "http://localhost:3000", // for development
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.json());

// endpoint to fetch all programs:
app.get("/programs", async (req, res) => {
  try {
    const sql = "SELECT * FROM programs";
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error("Error fetching programs:", err.message);
        res.status(500).json({ error: "Failed to fetch programs" });
      } else {
        res.json(rows);
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// catch-all for invalid routes:
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
