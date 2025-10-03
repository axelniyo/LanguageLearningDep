
const mysql = require('mysql2');
require('dotenv').config();

// Create connection pool for better performance
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 4000,  // TiDB Cloud uses 4000 by default
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'language_learning_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false,  // Only for development, set to `true` in production
  },
  connectTimeout: 10000,  // 10 seconds
  acquireTimeout: 60000,  // 60 seconds
  timeout: 60000,        // 60 seconds
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,  // 10 seconds
  reconnect: true,
  multipleStatements: true,  // Allow multiple SQL statements
});

// Create promise pool for async/await usage
const promisePool = pool.promise();

// Test database connection with more detailed testing
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    console.error('❌ Error code:', err.code);
    console.error('❌ Error errno:', err.errno);
    console.log('🔧 Make sure XAMPP is running and MariaDB is started');
    console.log('🔧 Check if database "language_learning_app" exists');
    console.log('🔧 Verify your database credentials in .env file');
  } else {
    console.log('✅ Connected to MariaDB database successfully!');
    
    // Test if we can actually query the database
    connection.query('SELECT 1 as test', (testErr, results) => {
      if (testErr) {
        console.error('❌ Database query test failed:', testErr.message);
      } else {
        console.log('✅ Database query test successful:', results);
      }
    });
    
    // Test if users table exists
    connection.query('SHOW TABLES LIKE "users"', (tableErr, tableResults) => {
      if (tableErr) {
        console.error('❌ Error checking users table:', tableErr.message);
      } else if (tableResults.length === 0) {
        console.error('❌ Users table does not exist! Please run the database setup scripts.');
      } else {
        console.log('✅ Users table exists');
        
        // Test if reset token columns exist
        connection.query('DESCRIBE users', (descErr, columns) => {
          if (descErr) {
            console.error('❌ Error describing users table:', descErr.message);
          } else {
            const hasResetToken = columns.some(col => col.Field === 'reset_token');
            const hasResetTokenExpiry = columns.some(col => col.Field === 'reset_token_expiry');
            
            if (!hasResetToken || !hasResetTokenExpiry) {
              console.error('❌ Reset token columns missing! Please run: server/database/add_reset_tokens.sql');
            } else {
              console.log('✅ Reset token columns exist');
            }
          }
        });
      }
    });
    
    connection.release();
  }
});

// Export both pool and promisePool
module.exports = pool;
module.exports.promisePool = promisePool;
