import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create the connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'language_learning_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  multipleStatements: true,
  timezone: 'local',
  charset: 'utf8mb4'
});

// Test the connection
async function testConnection() {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('✅ Connected to database successfully!');
    
    // Test a simple query
    const [rows] = await connection.query('SELECT 1 as test');
    console.log('✅ Database connection test successful');
    
    // Test if our database is accessible
    try {
      const [tables] = await connection.query('SHOW TABLES');
      console.log(`✅ Successfully connected to database: ${process.env.DB_NAME}`);
      console.log(`✅ Found ${tables.length} tables`);
    } catch (dbError) {
      console.error('❌ Database access error:', dbError.message);
      console.log('\nTroubleshooting steps:');
      console.log(`1. Check if database '${process.env.DB_NAME}' exists`);
      console.log('2. Verify the database user has proper permissions');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Error details:', {
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    console.log('\nTroubleshooting steps:');
    console.log('1. Make sure XAMPP is running and MariaDB service is started');
    console.log('2. Verify your database credentials in .env file');
    return false;
  } finally {
    if (connection) await connection.release();
  }
}

// Test the connection when the module loads
testConnection().catch(console.error);

export { pool };
export default pool;
