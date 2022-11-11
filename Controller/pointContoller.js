import express from "express";
import database from "../database.js";
import crypto from "crypto";

export const insertPoint = async (req, res) => {
  try {
    const { user_id, message, point } = req.body;
    if (
      Object.keys(req.body).length === 0 ||
      user_id == undefined ||
      message == undefined ||
      point == undefined
    ) {
      return res.status(400).send("Please enter valid data");
    } else {
      const response = await database.RunQuery(
        "SELECT * FROM user WHERE user_id =?",
        [user_id]
      );
      if (response.length === 0) {
        res.status(400).send("User not Found");
      } else {
        const point_id = crypto.randomBytes(12).toString("hex");
        const pointInsert = await database.RunQuery(
          "INSERT INTO point VALUES(?,?,?,?,?) ",
          [user_id, point_id, point, message, new Date().getTime()]
        );
        if ((pointInsert.affectedRows = 0)) {
          return res.status(400).send("Point insertion failed");
        } else {
          return res.status(200).send("Point insertion complete");
        }
      }
    }
  } catch (error) {
    res.status(404).send(error);
  }
};

export const getTotalPoint = async (req, res) => {
  try {
    const { user_id } = req.body;
    if (Object.keys(req.body).length === 0 || user_id == undefined) {
      return res.status(404).send("Please Enter valid Data");
    } else {
      const response = await database.RunQuery(
        "SELECT * FROM user WHERE user_id =? ",
        [user_id]
      );
      if (response.length === 0) {
        return res.status(400).send("No user found");
      } else {
        const responsepoint = await database.RunQuery(
          "SELECT point FROM point WHERE user_id =? ",
          [user_id]
        );
        let sum = 0;

        responsepoint.forEach((item) => (sum += parseInt(item.point)));
        // console.log(point);
        return res.status(200).send(`${sum}`);
      }
    }
  } catch (error) {
    res.status(404).send(error);
  }
};
export const getPointHistory = async (req, res) => {
  try {
    const { user_id } = req.body;
    if (Object.keys(req.body).length === 0 || user_id == undefined) {
      return res.status(404).send("Please Enter valid Data");
    } else {
      const response = await database.RunQuery(
        "SELECT * FROM user WHERE user_id =? ",
        [user_id]
      );
      if (response.length === 0) {
        return res.status(400).send("No user found");
      } else {
        const responsepoint = await database.RunQuery(
          "SELECT point FROM point WHERE user_id =? ",
          [user_id]
        );

        return res.status(200).send(responsepoint);
      }
    }
  } catch (error) {
    res.status(404).send(error);
  }
};
