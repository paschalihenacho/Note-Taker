const express = require('express');
const fs = require("fs");
const db = require("./db/db.json");
const crypto = require("crypto");
const path = require('path');

// Express
const app = express();
const PORT = process.env.PORT || 3001;

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
    savedNotes.prepend(newNote);

    // New notes to db.json
    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes), (err) => {
        if (err) throw err;
        res.json(savedNotes);
    });
    console.log("A new note has been successfully written!");
});

