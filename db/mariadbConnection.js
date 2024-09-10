const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

const pool_report = mariadb.createPool({
  host: process.env.REPORTS_DB_HOST,
  user: process.env.REPORTS_DB_USER,
  password: process.env.REPORTS_DB_PASSWORD,
  database: process.env.REPORTS_DB_NAME,
  port: process.env.REPORTS_DB_PORT
});

async function getMariaDBConnection() {
  return await pool.getConnection();
}

async function getReportsDBConnection() {
  return await pool_report.getConnection();
}

module.exports = { getMariaDBConnection, getReportsDBConnection };
