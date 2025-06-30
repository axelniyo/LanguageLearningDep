
const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/database');

// GET /api/vocabulary - Get all vocabulary items
router.get('/', async (req, res) => {
  try {
    console.log('API: Fetching all vocabulary items');
    const [rows] = await promisePool.execute(`
      SELECT 
        v.id,
        v.lesson_id,                               -- <-- ADD THIS LINE!
        v.word,
        v.translation,
        v.pronunciation,
        v.example_sentence,
        v.example_translation,
        v.word_type,
        v.difficulty_level,
        v.order_index,
        l.name as lesson_name
      FROM vocabulary v
      LEFT JOIN lessons l ON v.lesson_id = l.id
      ORDER BY v.order_index, v.word
    `);

    console.log(`Found ${rows.length} vocabulary items`);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching vocabulary:', error);
    res.status(500).json({ 
      error: 'Failed to fetch vocabulary',
      message: error.message 
    });
  }
});

// POST /api/vocabulary - Add a new vocabulary item
router.post('/', async (req, res) => {
  try {
    const { lesson_id, word, translation, pronunciation, example_sentence, example_translation, word_type, difficulty_level, order_index } = req.body;
    console.log('API: Adding new vocabulary item:', { lesson_id, word, translation, word_type });
    
    // Validate required fields
    if (!word || !translation) {
      return res.status(400).json({ 
        error: 'Word and translation are required fields' 
      });
    }

    // Insert new vocabulary item
    const [result] = await promisePool.execute(
      'INSERT INTO vocabulary (lesson_id, word, translation, pronunciation, example_sentence, example_translation, word_type, difficulty_level, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [lesson_id || null, word, translation, pronunciation || '', example_sentence || '', example_translation || '', word_type || 'noun', difficulty_level || 'beginner', order_index || 0]
    );

    console.log('✅ Vocabulary item added successfully with ID:', result.insertId);

    res.status(201).json({
      success: true,
      message: 'Vocabulary item added successfully',
      id: result.insertId
    });

  } catch (error) {
    console.error('Error adding vocabulary item:', error);
    res.status(500).json({
      error: 'Failed to add vocabulary item',
      message: error.message
    });
  }
});

module.exports = router;