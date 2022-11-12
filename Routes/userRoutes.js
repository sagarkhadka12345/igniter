import express from "express";
import {
  completeTodo,
  fecthTodoItem,
  fetchTodo,
  getMoodHistory,
  getStreak,
  insertMood,
  insertToDo,
  insertTodoItem,
  todoCompletedpercentage,
  userLogin,
  userRegister,
} from "../Controller/userController.js";
import { verify } from "../Verify/verifyToken.js";

const router = express.Router();

router.post("/", (req, res) => {
  res.send("Here");
});

router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/getuser", verify, insertMood);
router.post("/addmood", insertMood);
router.post("/getmoodhistory", getMoodHistory);
router.post("/getmoodstreak", getStreak);
router.post("/addtodo", verify, insertToDo);
router.post("/gettodo", verify, fetchTodo);
router.post("/getpercentage", todoCompletedpercentage);
router.post("/gettodoitem", verify, fecthTodoItem);
router.post("/completetodo", completeTodo);
router.post("/addtodoitem", verify, insertTodoItem);

export default router;
