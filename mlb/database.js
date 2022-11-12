const pool = require("./mysql");

class Database {
  async RunQuery(sql, parameterizedData) {
    let tempSQL = sql.split("?").length - 1;
    if (parameterizedData.length !== tempSQL) return false;

    let response = await new Promise((resolve, reject) => {
      pool.getConnection((err, conn) => {
        if (err) reject(err);
        conn.query(sql, parameterizedData, (err, result) => {
          conn.release();
          if (err) reject(err);
          resolve(result);
        });
      });
    });
    return response;
  }
}
module.exports = new Database();
