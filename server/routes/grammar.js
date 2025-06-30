const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/database');

// GET /api/grammar - Get all grammar rules or filter by lesson_id
router.get('/', async (req, res) => {
  try {
    const { lesson_id } = req.query;
    let rows;

    if (lesson_id) {
      console.log('API: Fetching grammar rules for lesson_id:', lesson_id);
      [rows] = await promisePool.execute(
        `
        SELECT 
          g.id,
          g.lesson_id,
          g.title,
          g.explanation,
          g.examples,
          g.difficulty_level,
          g.order_index,
          l.name as lesson_name
        FROM grammar_rules g
        LEFT JOIN lessons l ON g.lesson_id = l.id
        WHERE g.lesson_id = ?
        ORDER BY g.order_index, g.title
        `,
        [lesson_id]
      );
    } else {
      console.log('API: Fetching all grammar rules');
      [rows] = await promisePool.execute(`
        SELECT 
          g.id,
          g.lesson_id,
          g.title,
          g.explanation,
          g.examples,
          g.difficulty_level,
          g.order_index,
          l.name as lesson_name
        FROM grammar_rules g
        LEFT JOIN lessons l ON g.lesson_id = l.id
        ORDER BY g.order_index, g.title
      `);
    }
    
    console.log(`Found ${rows.length} grammar rules`);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching grammar rules:', error);
    res.status(500).json({ 
      error: 'Failed to fetch grammar rules',
      message: error.message 
    });
  }
});

// POST /api/grammar - Add a new grammar rule
router.post('/', async (req, res) => {
  try {
    const { lesson_id, title, explanation, examples, difficulty_level, order_index } = req.body;
    console.log('API: Adding new grammar rule:', { lesson_id, title, explanation });
    
    // Validate required fields
    if (!title || !explanation) {
      return res.status(400).json({ 
        error: 'Title and explanation are required fields' 
      });
    }
    
    // Insert new grammar rule
    const [result] = await promisePool.execute(
      'INSERT INTO grammar_rules (lesson_id, title, explanation, examples, difficulty_level, order_index) VALUES (?, ?, ?, ?, ?, ?)',
      [lesson_id || null, title, explanation, JSON.stringify(examples || []), difficulty_level || 'beginner', order_index || 0]
    );
    
    console.log('✅ Grammar rule added successfully with ID:', result.insertId);
    
    res.status(201).json({
      success: true,
      message: 'Grammar rule added successfully',
      id: result.insertId
    });
    
  } catch (error) {
    console.error('Error adding grammar rule:', error);
    res.status(500).json({
      error: 'Failed to add grammar rule',
      message: error.message
    });
  }
});

module.exports = router;