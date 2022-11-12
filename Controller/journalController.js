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
      console.log(response[0].inserted);

      response.forEach((item) => {
        if (parseInt(item.inserted) === parseInt(new Date().getDate())) {
          todayjournal.push(item);
        }
      });

      return res.status(200).send(todayjournal);
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
      console.log(response[0].inserted);

      response.forEach((item) => {
        if (parseInt(item.inserted) === parseInt(date)) {
          todayjournal.push(item);
        }
      });

      return res.status(200).send(todayjournal);
    }
  } catch (error) {
    res.status(404).send(error);
  }
};
export const getAllJournal = async (req, res) => {
  try {
    const { user_id } = req.body;
    if (Object.keys(req.body).length === 0 || user_id == undefined) {
      return res.status(400).send("Please provide valid inputs");
    } else {
      const journals = await database.RunQuery(
        "SELECT * FROM journal WHERE user_id =?",
        [user_id]
      );
      res.status(200).send(journals);
    }
  } catch (error) {
    res.status(404).send(error);
  }
};
