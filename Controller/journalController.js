import database from "../database.js";
import crypto from "crypto";
import moment from "moment";

export const getjournal = async (req, res) => {
  try {
    const { user_id } = req.body;
    if (Object.keys(req.body).length === 0 || user_id == undefined) {
      return res.status(404).send("Please Enter valid Data");
    } else {
      const journalResponse = await database.RunQuery(
        "SELECT * FROM journal WHERE user_id =?",
        [user_id]
      );
      return res.status(200).send(journalResponse);
    }
  } catch (error) {
    res.status(404).send(error);
  }
};

export const insertJournal = async (req, res) => {
  try {
    const { user_id, journal } = req.body;
    if (Object.keys(req.body).length === 0 || journal == undefined) {
      return res.status(404).send("Please Enter valid Data");
    } else {
      const user = await database.RunQuery(
        "SELECT user_id FROM user WHERE user_Id = ?",
        [user_id]
      );
      if (user.length === 0) {
        return res.status(400).send("No User Found");
      }

      const journal_id = crypto.randomBytes(12).toString("hex");
      const insertion = await database.RunQuery(
        "INSERT INTO journal VALUES (?,?,?,?)",
        [journal_id, user_id, journal, new Date()]
      );
      if (insertion.affectedRows > 0) {
        return res.status(200).send("Inserted successfully");
      }
      res.status(400).send("Insertion failed");
    }
  } catch (error) {
    res.status(404).send(error);
  }
};

export const gettodayjournal = async (req, res) => {
  try {
    const { user_id } = req.body;
    if (Object.keys(req.body).length === 0 || user_id == undefined) {
      return res.status(404).send("Please Enter valid Data");
    } else {
      const response = await database.RunQuery(
        "SELECT * FROM journal WHERE user_id =?",
        [user_id]
      );
      let todayjournal = [];
      response.forEach((item) => {
        if (moment(item.inserted).day() === moment().day()) {
          todayjournal.push(item);
        }
      });
      res.status(200).status(todayjournal);
    }
  } catch (error) {
    res.status(404).send(error);
  }
};

export const updatejournal = async (req, res) => {
  try {
    const { journal_id, journal } = req.body;
    if (
      Object.keys(req.body).length === 0 ||
      journal_id == undefined ||
      journal == undefined
    ) {
      return res.status(404).send("Please Enter valid Data");
    } else {
      const resp = await database.RunQuery(
        "SELECT * FROM journal WHERE journal_id =?",
        [journal_id]
      );
      if (resp.length === 0) {
        return res.status(400).send("No journal Found");
      } else {
        const journalUpdate = await database.RunQuery(
          "UPDATE journal SET journal=? WHERE journal_id=?",
          [journal, journal_id]
        );
        if (journalUpdate.affectedRows > 0) {
          return res.status(200).send("Journal update success");
        }
        res.status(400).send("Journal update failed");
      }
    }
  } catch (error) {}
};
export const getjournalbydate = async (req, res) => {
  try {
    const { user_id, date } = req.body;
    console.log(user_id, date);
    if (
      Object.keys(req.body).length === 0 ||
      date == undefined ||
      user_id == undefined
    ) {
      return res.status(404).send("Please Enter valid Data");
    } else {
      const response = await database.RunQuery(
        "SELECT * FROM journal WHERE user_id =?",
        [user_id]
      );
     
      let todayjournal = [];
      response.forEach((item) => {
        if (moment(item.inserted).day() === moment(date).day()) {
          todayjournal.push(item);
        }
      });
      res.status(200).status(todayjournal);
    }
  } catch (error) {
    res.status(404).send(error);
  }
};


