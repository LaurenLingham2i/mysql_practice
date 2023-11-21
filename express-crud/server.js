const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Create a MySQL connection
const connection = mysql.createConnection({
  port: "3307",
  password: "password",
  user: "root",
  database: "test"
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: ", err);
  } else {
    console.log("Connected to MySQL");
  }
});

// GET all albums
app.get("/albums", (req, res) => {
  connection.query("SELECT * FROM albums", (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

// GET a single album by ID
app.get("/albums/:id", (req, res) => {
  const albumId = parseInt(req.params.id);
  connection.query("SELECT * FROM albums WHERE id = ?", [albumId], (error, results) => {
    if (error) throw error;

    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ message: "Album not found" });
    }
  });
});

// POST a new album
app.post("/albums", (req, res) => {
  const newAlbum = req.body;
  connection.query("INSERT INTO albums SET ?", newAlbum, (error, result) => {
    if (error) throw error;
    newAlbum.id = result.insertId;
    res.status(201).json(newAlbum);
  });
});

// PUT an existing album by ID
app.put("/albums/:id", (req, res) => {
  const albumId = parseInt(req.params.id);
  const updatedAlbum = req.body;

  connection.query("UPDATE albums SET ? WHERE id = ?", [updatedAlbum, albumId], (error) => {
    if (error) throw error;
    res.json(updatedAlbum);
  });
});

// DELETE an album by ID
app.delete("/albums/:id", (req, res) => {
  const albumId = parseInt(req.params.id);
  connection.query("DELETE FROM albums WHERE id = ?", [albumId], (error) => {
    if (error) throw error;
    res.json({ message: "Album deleted successfully" });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
