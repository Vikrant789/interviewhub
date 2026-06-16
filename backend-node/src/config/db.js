const sql = require("mssql");

const config = {
  user: "sa",
  password: "StrongPassword@123!",
  server: "localhost",
  port: 1433,
  database: "InterviewHub",
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

module.exports = { sql, config };