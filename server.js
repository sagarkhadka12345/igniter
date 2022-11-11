import express from "express";

const app = express();

app.listen(3000, console.log("Working"));

app.use("/user", userRoutes);
