const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.RDS_HOSTNAME || "hogwash-2.c9sa4qq000qg.us-east-1.rds.amazonaws.com",
  user: process.env.RDS_USERNAME || "admin" || 'root',
  // password: '',
  password: process.env.RDS_PASSWORD || "Pear2546",
  database: process.env.RDS_DBNAME ||'hogwash',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;