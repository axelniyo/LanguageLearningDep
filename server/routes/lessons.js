const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/database');

// GET /api/lessons/:id - Get lesson by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('API: Fetching lesson with ID:', id);
    
    const [rows] = await promisePool.execute(`
      SELECT 
        l.id,
        l.name,
        l.description,
        l.lesson_type,
        l.order_index,
        l.xp_reward,
        l.created_at,
        u.name as unit_name,
        c.name as course_name
      FROM lessons l
      JOIN units u ON l.unit_id = u.id
      JOIN courses c ON u.course_id = c.id
      WHERE l.id = ?
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    
    const lesson = {
      id: rows[0].id.toString(),
      name: rows[0].name,
      description: rows[0].description,
      lesson_type: rows[0].lesson_type,
      order_index: rows[0].order_index,
      xp_reward: rows[0].xp_reward,
      created_at: rows[0].created_at,
      unit_name: rows[0].unit_name,
      course_name: rows[0].course_name
    };
    
    res.json(lesson);
  } catch (error) {
    console.error('Error fetching lesson:', error);
    res.status(500).json({ 
      error: 'Failed to fetch lesson',
      message: error.message 
    });
  }
});

// POST /api/lessons/progress - Mark lesson as completed for user
router.post('/progress', async (req, res) => {
  console.log('[POST /api/lessons/progress] Incoming payload:', req.body);
  try {
    const { userId, lessonId } = req.body;
    if (!userId || !lessonId) {
      console.warn('[POST /api/lessons/progress] Missing userId or lessonId');
      return res.status(400).json({ error: 'userId and lessonId are required' });
    }

    // Upsert user progress (mark completed, set score/Xp to lesson's xp_reward)
    // Try to insert, if duplicate, update
    let [lessonRows] = await promisePool.execute(
      'SELECT xp_reward FROM lessons WHERE id = ?',
      [lessonId]
    );
    if (!lessonRows.length) {
      console.error(`[POST /api/lessons/progress] Lesson ID not found in database: ${lessonId}`);
      return res.status(404).json({ error: 'Lesson not found' });
    }
    const xp = lessonRows[0].xp_reward;

    await promisePool.execute(
      `INSERT INTO user_progress (user_id, lesson_id, completed, score, completed_at)
        VALUES (?, ?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE completed = VALUES(completed), score = VALUES(score), completed_at = VALUES(completed_at), updated_at = NOW()`,
      [userId, lessonId, true, xp]
    );
    console.log(`[POST /api/lessons/progress] Progress saved: userId=${userId} lessonId=${lessonId} xp=${xp}`);
    res.json({ success: true });
  } catch (err) {
    console.error('[POST /api/lessons/progress] Error saving progress:', err);
    res.status(500).json({ error: 'Failed to save progress', message: err.message });
  }
});

// GET /api/lessons/progress/:userId/:courseId - get progress for user+course
router.get('/progress/:userId/:courseId', async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    if (!userId || !courseId) {
      return res.status(400).json({ error: 'userId and courseId are required' });
    }
    // Get all lessons for this course
    const [lessons] = await promisePool.execute(
      `SELECT l.id AS lesson_id, u.id as unit_id
       FROM lessons l
       JOIN units u ON l.unit_id = u.id
       WHERE u.course_id = ?`,
      [courseId]
    );
    if (lessons.length === 0) return res.json({ total:0, completed:0, xp:0 });

    // Get completed user progress for these lessons
    const lessonIds = lessons.map(row => row.lesson_id);
    const placeholders = lessonIds.map(() => '?').join(',');
    const [progressRows] = lessonIds.length
      ? await promisePool.execute(
          `SELECT lesson_id, completed, score FROM user_progress WHERE user_id = ? AND lesson_id IN (${placeholders})`,
          [userId, ...lessonIds]
        )
      : [[]];
    const completed = progressRows.filter(row => row.completed).length;
    const xp = progressRows.reduce((sum, row) => sum + (row.score || 0), 0);

    res.json({ 
      total: lessons.length,
      completed,
      xp
    });
  } catch (err) {
    console.error('Error fetching progress:', err);
    res.status(500).json({ error: 'Failed to load progress', message: err.message });
  }
});

// GET /api/lessons/progress/lesson/:userId/:lessonId - get progress for user+lesson
router.get('/progress/lesson/:userId/:lessonId', async (req, res) => {
  try {
    const { userId, lessonId } = req.params;
    if (!userId || !lessonId) {
      return res.status(400).json({ error: 'userId and lessonId are required' });
    }
    // Check for user progress for this lesson
    const [rows] = await promisePool.execute(
      `SELECT completed FROM user_progress WHERE user_id = ? AND lesson_id = ?`,
      [userId, lessonId]
    );
    if (!rows.length) {
      return res.json({ completed: false });
    }
    return res.json({ completed: Boolean(rows[0].completed) });
  } catch (err) {
    console.error('Error fetching lesson progress:', err);
    res.status(500).json({ error: 'Failed to load lesson progress', message: err.message });
  }
});

module.exports = router;