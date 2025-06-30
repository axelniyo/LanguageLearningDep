
# Language Learning API - Node.js Backend for XAMPP

This Node.js API server connects your React frontend to the XAMPP MariaDB database.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Database
1. Make sure XAMPP is running
2. Start Apache and MariaDB services
3. Create the database using the SQL schema provided earlier
4. Copy `.env.example` to `.env` and update if needed:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=language_learning
   ```

### 3. Run the Server
```bash
# Development mode (auto-restart on changes)
npm run dev

# Production mode
npm start
```

The API will run on: **http://localhost:3001**

## 📡 API Endpoints

### Languages
- `GET /api/languages` - Get all languages
- `GET /api/languages/:id` - Get language by ID

### Courses  
- `GET /api/courses` - Get all courses with language info
- `GET /api/courses/:id` - Get course by ID

### Units & Lessons
- `GET /api/courses/:courseId/units` - Get units for a course (includes lessons)
- `GET /api/lessons/:id` - Get lesson by ID

### Health Check
- `GET /health` - Server health status
- `GET /` - API documentation

## 🔧 Project Structure

```
server/
├── config/
│   └── database.js       # MariaDB connection setup
├── routes/
│   ├── languages.js      # Language endpoints
│   ├── courses.js        # Course endpoints  
│   ├── units.js          # Unit endpoints
│   └── lessons.js        # Lesson endpoints
├── server.js             # Main server file
├── package.json          # Dependencies
├── .env                  # Environment variables
└── README.md            # This file
```

## 🔌 Connecting to React Frontend

Your React app will make API calls to:
- Base URL: `http://localhost:3001/api`
- The `src/services/api.ts` file is already configured to use this API

## 🐛 Troubleshooting

**Database Connection Issues:**
- Make sure XAMPP is running
- Check if MariaDB service is started
- Verify database name exists: `language_learning`
- Check .env file configuration

**Port Issues:**
- Default port is 3001
- Make sure port 3001 is not in use
- Update PORT in .env file if needed

**CORS Issues:**
- Frontend URL is configured for `http://localhost:5173`
- Update FRONTEND_URL in .env if your React app runs on different port

## 📝 Notes

- This API uses connection pooling for better performance
- All database queries use prepared statements for security
- Comprehensive error handling and logging included
- Ready for production deployment
