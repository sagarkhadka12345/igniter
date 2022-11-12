//Importing
import jwt from "jsonwebtoken";

export const socketAuth = async (socket, next) => {
  try {
    const token = socket.handshake.query.token;

    if (!token) return socket.disconnect(true);

    const payload = jwt.verify(token, process.env.ACCESS_TOKEN);

    socket.user = payload;

    next();
  } catch (err) {
    return socket.disconnect(true);
  }
};
