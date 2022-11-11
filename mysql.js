import mysql from "mysql";

export const pool = mysql.createPool({
  host: "localhost",
  port: 4306,
  database: "igniter",
  password: "",
  user: "root",
});
