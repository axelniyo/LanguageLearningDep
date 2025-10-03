const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 4000,  // TiDB uses 4000 by default
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'language_learning_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true // enforces secure connection
  },
  connectTimeout: 10000,
  acquireTimeout: 60000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  multipleStatements: true,
});

// Test connection
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ Connected to TiDB database successfully!");

    const [rows] = await conn.query("SELECT 1 AS test");
    console.log("✅ Test query result:", rows);

    conn.release();
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    console.error("Code:", err.code);
    console.error("SQL State:", err.sqlState);
    console.log("🔧 Double-check .env credentials and SSL settings.");
  }
})();

module.exports = pool;
