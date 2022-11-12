const express = require("express");
const app = express();
app.listen(4000, () => console.log("listening at port: "));
const mlb = require("./mlb.js");
const insertJournal = require("./mlb");
const cors = require("cors");
const verify = require("./verifyToken");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post("/journal/addjournal", insertJournal);
