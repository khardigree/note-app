const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Get all notes
app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500).json({ message: "Internal server error" });
    }
    res.json(JSON.parse(data));
  });
});

// Save a new note
app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4();
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500).json({ message: "Internal server error" });
    }
    const notes = JSON.parse(data);
    notes.push(newNote);
    fs.writeFile("./db/db.json", JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        return res.sendStatus(500).json({ message: "Internal server error" });
      }
      res.json(newNote);
    });
  });
});

// Delete a note
app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500).json({ message: "Internal server error" });
    }
    const notes = JSON.parse(data);
    const newNotes = notes.filter((note) => note.id !== id);
    fs.writeFile("./db/db.json", JSON.stringify(newNotes), (err) => {
      if (err) {
        console.error(err);
        return res.sendStatus(500).json({ message: "Internal server error" });
      }
      res.sendStatus(200);
    });
  });
});

// HTML Routes
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});