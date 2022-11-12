import express from "express";
import {
  getAllJournal,
  getjournal,
  getjournalbydate,
  gettodayjournal,
  updatejournal,
} from "../Controller/journalController.js";

const router = express.Router();

router.post("/getjournal", getjournal);
router.post("/gettodayjournal", gettodayjournal);
router.post("/updatejournal", updatejournal);
router.post("/getjournalbydate", getjournalbydate);
router.post("/getalljournals", getAllJournal)

export default router;
