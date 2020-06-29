const express = require('express');
const fs = require("fs");
const db = require("./db/db.json");
const crypto = require("crypto");
const path = require('path');

// Express
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

app.get("/api/notes", (req, res) => {
    return res.json(db);
  });

app.post("/api/notes", (req, res) => {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let id = crypto.randomBytes(16).toString("hex");
    // object to hold new note
    let newNote = {
        title: req.body.title,
        text: req.body.text,
        id: id,
    }
    // show new note on the console
    console.log("newNote:", newNote)

    // pushes new notes to notes.index
    savedNotes.push(newNote);

    // New notes to db.json
    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes), (err) => {
        if (err) throw err;
        res.json(savedNotes);
    });
    console.log("A new note has been successfully written!");
});

app.delete("/api/notes/:id", (req, res) => {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteID = savedNotes.filter(x=>x.id!=req.params.id)

    console.log("NOTE ID", noteID)
    console.log("REQ.PARAMS.ID", req.params.id)

    fs.writeFile("./db/db.json", JSON.stringify(noteID), (err) => {
        if (err) throw err; 
        res.json(savedNotes);
        });
        console.log("Note successfully deleted!");
})

// Page Routes
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
    console.log("notes")
  });
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
    console.log("html")
  });

  // Starts the server to begin listening
app.listen(PORT, () => {
    console.log('App listening on PORT: ' + PORT);
  });