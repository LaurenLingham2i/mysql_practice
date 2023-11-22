const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Create a MySQL connection
const connection = mysql.createConnection({
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

// GET all artists
app.get("/", (req, res) => {
    connection.query("SELECT * FROM artists", (error, results) => {
      if (error) throw error;
      res.json(results);
    });
  });

// GET a single artist by ID
app.get("/:id", (req, res) => {
    const artistId = parseInt(req.params.id);
    connection.query("SELECT * FROM artists WHERE id = ?", [artistId], (error, results) => {
      if (error) throw error;
      res.json(results);
    });
  });

// GET all albums with artist name listed
app.get("/albums", (req, res) => {
  connection.query(`
  SELECT albums.id, artists.name AS artist_name, albums.title, albums.year_released, albums.genre, albums.num
  FROM albums
  JOIN artists ON albums.artist = artists.id;
`, (error, results) => {
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

// GET a single album by title
app.get("/album/:title", (req, res) => {
  const albumTitle = req.params.title;
  connection.query(`
  SELECT albums.id, artists.name AS artist_name, albums.title, albums.year_released, albums.genre
  FROM albums
  JOIN artists ON albums.artist = artists.id WHERE title = ?
  `, [albumTitle], (error, results) => {
    if (error) throw error;
    res.json(results[0]);
  });
});

// GET albums by genre
app.get("/albums/genre/:genre", (req, res) => {
    const genre = req.params.genre;
    connection.query(`
    SELECT albums.id, artists.name AS artist_name, albums.title, albums.year_released, albums.genre
    FROM albums
    JOIN artists ON albums.artist = artists.id
    WHERE albums.genre = ?;
    `, [genre], (error, results) => {
      if (error) throw error;
      res.json(results);
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
