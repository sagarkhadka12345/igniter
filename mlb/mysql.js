const mysql = require("mysql");
const pool = mysql.createPool({
  host: "localhost",
  port: 4306,
  database: "igniter",
  password: "",
  user: "root",
});

module.exports = pool;
