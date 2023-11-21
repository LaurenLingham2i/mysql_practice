DROP TABLE IF EXISTS albums;
DROP TABLE IF EXISTS artists;

CREATE TABLE artists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100)
);

CREATE TABLE albums (
    id INT AUTO_INCREMENT PRIMARY KEY,
    artist INT NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
    title VARCHAR(255),
    year_released INT,
    genre VARCHAR(255),
    num INT
);

INSERT INTO artists (name) VALUES ("Biffy Clyro");
INSERT INTO artists (name) VALUES ("Brand New");
INSERT INTO artists (name) VALUES ("Rise Against");
INSERT INTO artists (name) VALUES ("Eminem");
INSERT INTO artists (name) VALUES ("Hell Is For Heroes");

INSERT INTO albums (artist, title, year_released, genre, num) VALUES
(1, "Opposites", 2018, "Rock", 1),
(1, "Blackened Sky", 2002, "Rock", 2),
(2, "The Devil and God Are Raging Inside Me", 2006, "Alt rock", 3),
(3, "The Sufferer & the Witness", 2006, "Punk rock", 4),
(4, "The Marshall Mathers LP", 2000, "Rap", 5),
(4, "Revival", 2017, "Rap", 6),
(5, "The Neon Handshake", 2003, "Post hardcore", 7);

SELECT * FROM albums WHERE title = "Revival" LIMIT 1;

SELECT * FROM albums WHERE genre = "Rock";

UPDATE albums 
JOIN (SELECT id FROM albums WHERE title = "The Sufferer & the Witness" LIMIT 1) AS subquery
SET albums.genre = "Rock" 
WHERE albums.id = subquery.id;

-- DELETE FROM albums WHERE title = "Revival" LIMIT 1;

-- DELETE FROM albums WHERE genre = "Rock";

SELECT COUNT(*) AS album_count FROM albums;

SELECT COUNT(*) AS rock_album_count
FROM albums WHERE genre = "Rock";

SELECT SUM(num) AS total_num FROM albums;

SELECT albums.id, artists.name AS artist_name, albums.title, albums.year_released, albums.genre, albums.num
FROM albums
JOIN artists ON albums.artist = artists.id;