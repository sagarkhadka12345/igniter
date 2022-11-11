import express from "express";
import {
  getPointHistory,
  getTotalPoint,
  insertPoint,
} from "../Controller/pointContoller.js";

const router = express.Router();

router.post("/addpoint", insertPoint);
router.post("/gettotalpoint", getTotalPoint);
router.post("/getpointhistory", getPointHistory);
router.post("/")

export default router;
