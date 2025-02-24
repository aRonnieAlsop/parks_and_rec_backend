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

// Middleware for JSON body parsing (placed before any endpoints that require JSON parsing)
app.use(express.json());

// ✅ **Fetch all programs**
app.get('/programs', (req, res) => {
  const sql = 'SELECT * FROM programs';
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching programs:', err.message);
      res.status(500).json({ error: 'Failed to fetch programs' });
    } else {
      res.json(rows);
    }
  });
});

// for adding new event from admin end: 
app.post('/programs', (req, res) => {
  const { name, location, description, start_date, start_time, end_time, repeats, repeat_type } = req.body;
  
  // validate required fields
  if (!name || !location || !start_date || !start_time || !end_time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const sql = `
    INSERT INTO programs (name, location, description, start_date, start_time, end_time, repeats, repeat_type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.run(sql, [name, location, description, start_date, start_time, end_time, repeats, repeat_type], function(err) {
    if (err) {
      console.error("Error adding event:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Event added successfully', id: this.lastID });
  });
});


// ✅ **Register for a program (NEW POST ROUTE)**
app.post('/register', (req, res) => {
  const { program_id, full_name, age, special_notes } = req.body;

  if (!program_id || !full_name || !age) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const sql = `INSERT INTO roster (program_id, full_name, age, special_notes) VALUES (?, ?, ?, ?)`;
  db.run(sql, [program_id, full_name, age, special_notes || ''], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Registration successful', id: this.lastID });
  });
});

// ✅ **Fetch all roster**
app.get('/roster', (req, res) => {
  const sql = 'SELECT * FROM roster';
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching roster:', err.message);
      res.status(500).json({ error: 'Failed to fetch roster' });
    } else {
      res.json(rows);
    }
  });
});

app.post('/pay', (req, res) => {
  const { program_id, full_name, age, special_notes, card_number, expiration, cvv } = req.body;

  // Fake validation
  if (!program_id || !full_name || !age || !card_number || !expiration || !cvv) {
      return res.status(400).json({ error: 'Missing required fields' });
  }

  // Fake card validation (just checking if the card has 16 digits)
  if (card_number.length !== 16 || isNaN(card_number)) {
      return res.status(400).json({ error: 'Invalid card details' });
  }

  // Simulate successful payment
  console.log(`Payment processed for ${full_name} - Program ID: ${program_id}`);

  // insert into the roster with `paid = 1`
  const sql = `INSERT INTO roster (program_id, full_name, age, special_notes, paid) VALUES (?, ?, ?, ?, 1)`;
  db.run(sql, [program_id, full_name, age, special_notes || '', 1], function (err) {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: 'Registration successful with payment!', id: this.lastID });
  });
});

// fetch registrants only if they have paid: (in real 🌍 scenario, they possibly won't be able to sign up w/out paying)
app.get('/roster/:program_id', (req, res) => {
  const { program_id } = req.params;

  const sql = `SELECT roster.id, roster.full_name, roster.age, roster.special_notes, roster.paid, programs.name as program_name
               FROM roster 
               JOIN programs ON roster.program_id = programs.id
               WHERE roster.program_id = ? AND roster.paid = 1`;
               
  db.all(sql, [program_id], (err, rows) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.json(rows);
  });
});


// ✅ **catch-all for invalid routes (placed LAST)**
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
