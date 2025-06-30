import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Alert, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';

const AddGrammar = () => {
  const [lessons, setLessons] = useState([]);
  const [lessonId, setLessonId] = useState('');
  const [title, setTitle] = useState('');
  const [explanation, setExplanation] = useState('');
  const [examples, setExamples] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('beginner');
  const [orderIndex, setOrderIndex] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/lessons').then(res => {
      setLessons(res.data);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError('');
    try {
      await axios.post('/api/grammar', {
        lesson_id: lessonId,
        title,
        explanation,
        examples,
        difficulty_level: difficultyLevel,
        order_index: orderIndex
      });
      setSuccess(true);
      setTitle('');
      setExplanation('');
      setExamples('');
      setDifficultyLevel('beginner');
      setOrderIndex('');
      setLessonId('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding grammar rule');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        Add Grammar Rule
      </Typography>
      {success && <Alert severity="success">Grammar rule added successfully!</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      <FormControl fullWidth margin="normal" required>
        <InputLabel>Lesson</InputLabel>
        <Select
          value={lessonId}
          label="Lesson"
          onChange={e => setLessonId(e.target.value)}
        >
          {lessons.map(lesson => (
            <MenuItem key={lesson.id} value={lesson.id}>{lesson.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Explanation"
        value={explanation}
        onChange={e => setExplanation(e.target.value)}
        required
        fullWidth
        margin="normal"
        multiline
        minRows={2}
      />
      <TextField
        label="Examples (JSON array)"
        value={examples}
        onChange={e => setExamples(e.target.value)}
        fullWidth
        margin="normal"
        placeholder='[{"jp":"...","en":"..."}]'
      />
      <TextField
        label="Difficulty Level"
        value={difficultyLevel}
        onChange={e => setDifficultyLevel(e.target.value)}
        required
        fullWidth
        margin="normal"
        select
      >
        <MenuItem value="beginner">Beginner</MenuItem>
        <MenuItem value="intermediate">Intermediate</MenuItem>
        <MenuItem value="advanced">Advanced</MenuItem>
      </TextField>
      <TextField
        label="Order Index"
        value={orderIndex}
        onChange={e => setOrderIndex(e.target.value)}
        required
        fullWidth
        margin="normal"
        type="number"
      />
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Add Grammar Rule
      </Button>
    </Box>
  );
};

export default AddGrammar;
