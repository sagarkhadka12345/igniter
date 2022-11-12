import express from "express";
import { pool } from "./mysql.js";
import userRoutes from "./Routes/userRoutes.js";
import crypto from "crypto";
import dotenv from "dotenv";
import cors from "cors";
import pointRoutes from "./Routes/pointRoutes.js";
import journalRoutes from "./Routes/journalRoutes.js";
import { socketAuth } from "./socketauth.js";
import { Server } from "socket.io";
import http from "http";
import { verify } from "./Verify/verifyToken.js";

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
const httpServer = http.createServer(app);

httpServer.listen(3000, () =>
  console.log(`Listening on Port ${process.env.PORT}`)
);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});
let roomList = [
  "Sagarmatha",
  "Annapurna",
  "Kanchanjunga",
  "Dhaulagiri",
  "Manaslu",
];
let num = 0;
let indexOfSender = 0;
let users = [];
let chats = {};

io.use(socketAuth);

io.on("connection", (socket) => {
  console.log("connected");
  while (
    io.sockets.adapter.rooms.get(roomList[num]) &&
    io.sockets.adapter.rooms.get(roomList[num]).keys.length >= 15
  ) {
    num = num + 1;
  }
  socket.join(roomList[num]);

  if (chats.hasOwnProperty(roomList[num])) {
    chats[roomList[num]].push({
      user_id: socket.user.user_id,
      message: `A new user connected`,
      location: socket.user.location,
      socketid: socket.id,
    });
  } else {
    chats[roomList[num]] = [
      {
        user_id: socket.user.user_id,
        message: `A new user connected`,
        location: socket.user.location,
        socketid: socket.id,
      },
    ];
  }

  socket.emit("get-history", {
    room: roomList[num],
    members:
      io.sockets.adapter.rooms.get(roomList[num]) &&
      io.sockets.adapter.rooms.get(roomList[num]).size,
    chat: chats[roomList[num]],
  });
  io.to(roomList[num]).emit("receive-join", {
    user_id: socket.user.user_id,
    message: "A new user connected:",
    members:
      io.sockets.adapter.rooms.get(roomList[num]) &&
      io.sockets.adapter.rooms.get(roomList[num]).size,
    location: socket.user.location,
  });

  socket.on("join", (room, user) => {
    io.to(roomList[num]).emit(`New User Connected:`);
    indexOfSender = users.findIndex((item) => item.user_id === user.user_id);
    if (indexOfSender > -1) {
      return (users[indexOfSender] = item);
    } else {
      return users.push(item);
    }
  });

  socket.on("send-message", ({ message }) => {
    chats[roomList[num]].push({
      user_id: socket.user.user_id,
      message: message,
      location: socket.user.location,
    });

    io.to(roomList[num]).emit("receive-message", {
      user_id: socket.user.user_id,
      message: message,
      location: socket.user.location,
    });
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.use("/user", userRoutes);
app.use("/point", pointRoutes);
app.use("/journal", journalRoutes);
