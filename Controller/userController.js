import mysql from "mysql";
import express from "express";
import crypto from "crypto";
import database from "../database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const userRegister = async (req, res) => {
  try {
    const { fullname, phone, password, location } = req.body;

    if (
      Object.keys(req.body).length === 0 ||
      fullname == undefined ||
      phone == undefined ||
      password == undefined ||
      location == undefined
    ) {
      return res.send("please provide valid request");
    } else {
      const aleradyRegistered = await database.RunQuery(
        "SELECT * FROM user WHERE phone =?",
        [phone]
      );
      if (aleradyRegistered.length > 0) {
        return res.status(400).send("User already exist");
      } else {
        const hashedpassword = await bcrypt.hash(password, 12);
        if (password.length < 8 || password.length > 64) {
          return res
            .status(400)
            .send(
              "password must be more than 8 characters and less than 64 characters"
            );
        } else if (phone.length < 10 || phone.length > 10) {
          return res.status(400).send("phone must be 10 digits");
        }
        const user_id = crypto.randomBytes(12).toString("hex");
        // console.log(fullname, phone, hashedpassword, user_id, new Date());
        const response = await database.RunQuery(
          "INSERT INTO user VALUES(?,?,?,?,?,?,?)",
          [fullname, phone, hashedpassword, user_id, "", location, new Date()]
        );

        if (response.affectedRows > 0) {
          return res.status(200).send("OK");
        }
        res.status(400).send("not working");
      }
    }
  } catch (error) {
    res.status(402).send(error);
  }
};

export const userLogin = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).send("please provide valid request");
    } else {
      const { phone, password } = req.body;
      if (phone === undefined || password === undefined) {
        return res.status(400).send("Request Invalid");
      } else {
        if (password.length < 8 || password.length > 64) {
          res
            .status(400)
            .send(
              "password must be more than 8 characters and less than 64 characters"
            );
        } else if (phone.length < 10 || phone.length > 10) {
          res.status(400).send("phone must be 10 digits");
        }
        const hashedpassword = await database.RunQuery(
          "SELECT * FROM user WHERE phone = ?",
          [phone]
        );
        if (hashedpassword.length === 0) {
          return res.status(200).send("User doesnot exist");
        }
        const passwordmatch = await bcrypt.compare(
          password,
          hashedpassword[0].password
        );

        const accesstoken = jwt.sign(
          {
            user_id: hashedpassword[0].user_id,
            full_name: hashedpassword[0].full_name,
            location: hashedpassword[0].location,
          },
          process.env.ACCESS_TOKEN,
          {
            expiresIn: "4d",
          }
        );
        if (passwordmatch) {
          const user = await database.RunQuery(
            "SELECT user_id FROM user WHERE phone =?",
            [phone]
          );

          const alreadyInserted = await database.RunQuery(
            "SELECT date , mood FROM mood_history WHERE user_id =? LIMIT 1",
            [user[0].user_id]
          );

          const remTime =
            parseInt(new Date().getTime()) -
              parseInt(
                alreadyInserted.length !== 0 && alreadyInserted[0].date
              ) >
            6 * 60 * 60 * 1000;

          const remData = remTime || !alreadyInserted.length;

          return res.status(200).send({
            userid: hashedpassword[0].user_id,
            fullname: hashedpassword[0].full_name,
            phone: hashedpassword[0].phone,
            createdAt: hashedpassword[0].inserted,
            accesstoken: accesstoken,
            mood: remData ? "1" : "0",
            latestMood: remData ? null : alreadyInserted[0].mood,
          });
        } else {
          res.status(400).send("Invalid credentials");
        }
      }
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

export const insertMood = async (req, res) => {
  try {
    const { user_id, mood } = req.body;
    if (
      user_id === undefined ||
      mood === undefined ||
      req.body === undefined ||
      Object.keys(req.body).length === 0
    ) {
      return res.status(401).send("Invalid Request");
    }
    const response = await database.RunQuery(
      "SELECT * from user WHERE user_id =?",
      [user_id]
    );
    const mood_id = crypto.randomBytes(12).toString("hex");

    if (response.length === 0) {
      return res.status(400).send("No user Found");
    } else {
      const alreadyInserted = await database.RunQuery(
        "SELECT date , time FROM mood_history WHERE user_id =? ORDER BY date DESC",
        [user_id]
      );

      const remTime =
        parseInt(new Date().getTime()) -
          parseInt(alreadyInserted[0] && alreadyInserted[0].date) >
        6 * 60 * 60 * 1000;
      if (!remTime && alreadyInserted.length > 0) {
        return res.status(400).send("Rem Time");
      } else {
        console.log("Here");
        const insert = await database.RunQuery(
          "INSERT INTO mood_history VALUES (?,?,?,?,?)",
          [mood_id, user_id, mood, new Date().getTime(), new Date().getHours()]
        );
        if (insert.affectedRows > 0) {
          return res.status(200).send("Mood Inserted");
        } else {
          return res.status(400).send("Insertion error");
        }
      }
    }
    // else{
    //   res.status(400).send("Rem time")
    // }
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getMoodHistory = async (req, res) => {
  try {
    const { user_id } = req.body;
    if (Object.keys(req.body).length === 0 || user_id == undefined) {
      return res.status(400).send("please provide valid request");
    } else {
      const response = await database.RunQuery(
        "SELECT * FROM mood_history WHERE user_id=? ORDER BY date DESC LIMIT 30",
        [user_id]
      );
      res.status(200).send(response);
    }
  } catch (error) {
    res.status(404).send(error);
  }
};

export const getStreak = async (req, res) => {
  try {
    const { user_id } = req.body;
    if (Object.keys(req.body).length === 0 || user_id == undefined) {
      return res.status(400).send("please provide valid request");
    } else {
      const response = await database.RunQuery(
        "SELECT * FROM mood_history WHERE user_id=? ORDER BY date DESC",
        [user_id]
      );
      let streak = 0;
      response.every((item) => {
        if (item.mood.toLowerCase() !== "happy") {
          return false;
        }
        streak = streak + 1;
        return true;
      });
      res.status(200).send(`${streak}`);
    }
  } catch (error) {
    res.status(404).send(error);
  }
};

export const insertToDo = async (req, res) => {
  try {
    const { user_id } = req.body;
    if (Object.keys(req.body).length === 0 || user_id == undefined) {
      return res.status(400).send("please provide valid request");
    } else {
      console.log();
      const userfound = await database.RunQuery(
        "SELECT user_id FROM user WHERE user_id = ?",
        [user_id]
      );
      if (userfound.length === 0) {
        return res.status(400).send("No user Found");
      } else {
        const todos = await database.RunQuery(
          "SELECT * FROM todo WHERE user_id =? ",
          [user_id]
        );
        const todo_id = crypto.randomBytes(12).toString("hex");
        const insertTodo = await database.RunQuery(
          "INSERT INTO todo VALUES (?,?,?)",
          [todo_id, user_id, new Date()]
        );
        if (insertTodo.affectedRows > 0) {
          return res.status(200).send("Insertion successfully");
        } else {
          return res.status(400).send("Inserted unsuccesfully");
        }
      }
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

export const insertTodoItem = async (req, res) => {
  try {
    console.log(req.body);
    const { todo_id, todo, completion_time } = req.body;
    if (Object.keys(req.body).length === 0 || todo_id == undefined) {
      return res.status(400).send("please provide valid request");
    } else {
      const resp = await database.RunQuery(
        "SELECT todo_id FROM todo WHERE todo_id=?",
        [todo_id]
      );
      if (resp.length === 0) {
        return res.status(400).send("Todo not found");
      } else {
        const todos_item_id = crypto.randomBytes(12).toString("hex");
        const todos = await database.RunQuery(
          "INSERT INTO todo_list VALUES (?,?,?,?,?,?)",
          [todos_item_id, todo_id, todo, "23:00", "false", new Date().getDate()]
        );
        if (todos.affectedRows === 0 || !todos) {
          res.status(400).send("Insertion failed");
        } else {
          res.status(200).send("Insertion complete");
        }
      }
    }
  } catch (error) {
    res.status(404).send(error);
  }
};

export const fetchTodo = async (req, res) => {
  try {
    const { user_id } = req.body;
    if (Object.keys(req.body).length === 0 || user_id == undefined) {
      return res.status(400).send("please provide valid request");
    }
    const userTodo = await database.RunQuery(
      "SELECT * FROM todo WHERE user_id =? ",
      [user_id]
    );
    res.status(200).send(userTodo);
  } catch (error) {
    res.send("Invalid");
  }
};

export const fecthTodoItem = async (req, res) => {
  try {
    const { todo_id } = req.body;
    if (Object.keys(req.body).length === 0 || todo_id == undefined) {
      return res.status(400).send("please provide valid request");
    } else {
      const userTodo = await database.RunQuery(
        "SELECT * FROM todo_list WHERE todo_id =?  AND inserted LIKE ?",
        [todo_id, new Date().getDate()]
      );

      res.status(200).send(userTodo);
    }
  } catch (error) {
    res.status(404).send(error);
  }
};
export const completeTodo = async (req, res) => {
  try {
    const { todo_item_id } = req.body;
    if (Object.keys(req.body).length === 0 || todo_item_id == undefined) {
      return res.status(400).send("please provide valid request");
    } else {
      console.log(todo_item_id);
      const responseTodo = await database.RunQuery(
        "SELECT * FROM todo_list WHERE todo_item_id=?",
        [todo_item_id]
      );
      if (responseTodo.length === 0) {
        return res.status(400).send("No Todo Found");
      } else {
        const updation = await database.RunQuery(
          "UPDATE todo_list SET completed = 'true' WHERE  todo_item_id=?",
          [todo_item_id]
        );
        if (updation.affectedRows === 0) {
          return res.status(400).send("Insertion failed");
        } else {
          return res.status(200).send("Todo updated");
        }
      }
    }
  } catch (error) {
    res.status(404).send(error);
  }
};

export const fecthAllTodoItem = async (req, res) => {
  try {
    const { todo_id } = req.body;
    if (Object.keys(req.body).length === 0 || todo_id == undefined) {
      return res.status(400).send("please provide valid request");
    } else {
      const userTodo = await database.RunQuery(
        "SELECT * FROM todo_list WHERE todo_id =? ",
        [todo_id, new Date().getDate()]
      );

      res.status(200).send(userTodo);
    }
  } catch (error) {
    res.status(404).send(error);
  }
};

export const todoCompletedpercentage = async (req, res) => {
  try {
    const { user_id } = req.body;
    if (Object.keys(req.body).length === 0 || user_id == undefined) {
      return res.status(400).send("please provide valid request");
    } else {
      const userTodo = await database.RunQuery(
        "SELECT * FROM todo_list WHERE todo_id = ? AND inserted =?",
        [todo_id, new Date().getDate()]
      );

      const completeTodo = await database.RunQuery(
        "SELECT * FROM todo_list WHERE todo_id = ? AND completed= 'true' AND inserted = ?",
        [todo_id, new Date().getDate()]
      );

      return res.status(200).send(completeTodo.length / userTodo.length);
    }
  } catch (error) {
    res.status(404).send(error);
  }
};
