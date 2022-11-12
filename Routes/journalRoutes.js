import express from "express";
import {
  getjournal,
  getjournalbydate,
  gettodayjournal,
  insertJournal,
  updatejournal,
} from "../Controller/journalController.js";

const router = express.Router();

router.post("/getjournal", getjournal);
router.post("/addjournal", insertJournal);
router.post("/gettodayjournal", gettodayjournal);
router.post("/updatejournal", updatejournal);
router.post("/getjournalbydate", getjournalbydate)


export default router;
