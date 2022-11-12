import express from "express";
import { pool } from "./mysql.js";
import userRoutes from "./Routes/userRoutes.js";
import crypto from "crypto";
import dotenv from "dotenv";
import cors from "cors";
import pointRoutes from "./Routes/pointRoutes.js";
import journalRoutes from "./Routes/journalRoutes.js";
import { Server, Socket } from "socket.io";
import http from "http";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const httpServer = http.createServer(app);
httpServer.listen(process.env.PORT, () =>
  console.log(`Listening on Port ${process.env.PORT}`)
);

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

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});
let roomList = [
  "1def",
  "2ghi",
  "3iom",
  "4kef",
  "5xyz",
  "6aue",
  "7qwe",
  "8zxm",
  "9abc",
];
let num = 1;
io.on("connection", (socket) => {
  var room = "room" + num;
  while (io.sockets.adapter.rooms.get(room).size >= 15) {
    num = num + 1;
  }
  socket.join(room);
  socket.current_room = room;

  socket.on("send-message", ({ message, roomName }) => {
    socket.to(room).emit("receive-message", message);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.use("/user", userRoutes);
app.use("/point", pointRoutes);
app.use("/journal", journalRoutes);
