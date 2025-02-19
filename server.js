import express from "express";
import cors from "cors";
import db from "./db.js"; 
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

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

// serve static files (images):
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// configured multer for image uploads:
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // rename file with timestamp
  },
});


const upload = multer({ storage });

// route to upload an image:
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

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
