const express = require("express");
const aposToLexForm = require("apos-to-lex-form");
const SW = require("stopword");
const database = require("./database");
const natural = require("natural");
const crypto = require("crypto");

const insertJournal = async (req, res) => {
  try {
    const { user_id, journal } = req.body;

    if (
      Object.keys(req.body).length === 0 ||
      journal == undefined ||
      user_id == undefined
    ) {
      return res.status(404).send("Please Enter valid Data");
    } else {
      const user = await database.RunQuery(
        "SELECT *  FROM user WHERE user_id = ?",
        [user_id]
      );
      if (user.length === 0) {
        return res.status(400).send("No User Found");
      }
      const lexedJournal = aposToLexForm(journal);
      const casedReview = lexedJournal.toLowerCase();
      const alphaOnlyReview = casedReview.replace(/[^a-zA-Z\s]+/g, "");
      const { WordTokenizer } = natural;
      const tokenizer = new WordTokenizer();
      const tokenizedReview = tokenizer.tokenize(alphaOnlyReview);
      const filteredReview = SW.removeStopwords(tokenizedReview);
      const { SentimentAnalyzer, PorterStemmer } = natural;
      const analyzer = new SentimentAnalyzer("English", PorterStemmer, "afinn");
      const analysis = analyzer.getSentiment(filteredReview);
      const point_id = crypto.randomBytes(12).toString("hex");
      const journal_id = crypto.randomBytes(12).toString("hex");

      const insertion = await database.RunQuery(
        "INSERT INTO journal VALUES (?,?,?,?,?)",
        [journal_id, user_id, journal, analysis, new Date().getDate()]
      );
      let point = analysis > 0 && Math.ceil(analysis * 0.5);
      console.log(point);
      const message = `Point From Journal ${journal_id}`;

      const pointUpdate =
        point &&
        (await database.RunQuery("INSERT INTO point VALUES(?,?,?,?,?)", [
          user_id,
          point_id,
          point,
          message,
          new Date().getTime(),
        ]));
      console.log(insertion, pointUpdate);
      if (insertion.affectedRows > 0) {
        return res.status(200).send("Inserted successfully");
      }
      res.status(400).send("Insertion failed");
    }
  } catch (error) {
    res.status(404).send(error);
  }
};

module.exports = insertJournal;
