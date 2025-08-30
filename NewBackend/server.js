const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Varun@23",
  database: "newappdb",
});

db.connect(err => {
  if (err) throw err;
  console.log("✅ MySQL Connected");
});

// GET rows
app.get("/api/rows", (req, res) => {
  db.query("SELECT * FROM items", (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// POST row
app.post("/api/rows", (req, res) => {
  const { name, description } = req.body;
  console.log("📥 Incoming data:", req.body);

  const sql = "INSERT INTO items (name, description) VALUES (?, ?)";
  db.query(sql, [name, description], (err, result) => {
    if (err) {
      console.error("❌ SQL Error:", err.sqlMessage);
      return res.status(500).json({ error: err.sqlMessage });
    }
    console.log("✅ Row added:", result.insertId);
    res.json({ message: "✅ Row added", id: result.insertId });
  });
});





// app.listen(3001, () => {
//   console.log("🚀 Server running on http://localhost:3001");
// });
app.listen(3001, "0.0.0.0", () => {
  console.log("🚀 Server running on http://0.0.0.0:3001 (accessible on your local network)");
});
