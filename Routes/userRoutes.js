import express from "express";
import {
  completeTodo,
  fetchTodo,
  getMoodHistory,
  insertMood,
  insertToDo,
  insertTodoItem,
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
router.post("/insertmood", insertMood);
// router.get("/checkAddMood", verify, checkMoodAdd);
router.post("/addtodo", verify, insertToDo);
router.get("/gettodo", verify, fetchTodo);
router.post("/completetodo", verify, completeTodo);
router.post("/inserttodoitem", verify, insertTodoItem);
router.post("/getmoodhistory", getMoodHistory);

export default router;
