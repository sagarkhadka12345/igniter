import express from "express";
import { pool } from "./mysql.js";
import userRoutes from "./Routes/userRoutes.js";
import crypto from "crypto";
import dotenv from "dotenv";
import cors from "cors";
import pointRoutes from "./Routes/pointRoutes.js";
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(
    `Incoming-> Method: [ ${req.method}] url:[${req.url}] IP: [${req.socket.remoteAddress}]`
  );

  res.on("finish", () => {
    console.log(
      `Incoming-> Method: [ ${req.method}] url:[${req.url}] IP: [${req.socket.remoteAddress}]  status:[${res.status}]`
    );
  });
  next();
});

app.listen(process.env.PORT, console.log("Working at port 3000"));

app.use("/user", userRoutes);
app.use("/point", pointRoutes);
