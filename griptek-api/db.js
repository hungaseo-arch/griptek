// MySQL 커넥션 풀 (mysql2/promise)
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 5,          // shared hosting 리소스 절약
  charset: 'utf8mb4_unicode_ci',
  // DECIMAL 을 number 로 받기(금액 계산용). 정밀도 큰 값이면 string 고려.
  decimalNumbers: true,
});

module.exports = pool;
