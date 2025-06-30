import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Alert, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';

const AddExercise = () => {
  const [lessons, setLessons] = useState([]);
  const [lessonId, setLessonId] = useState('');
  const [exerciseType, setExerciseType] = useState('fill_blank');
  const [question, setQuestion] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [options, setOptions] = useState('');
  const [explanation, setExplanation] = useState('');
  const [hints, setHints] = useState('');
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
      await axios.post('/api/exercises', {
        lesson_id: lessonId,
        exercise_type: exerciseType,
        question,
        correct_answer: correctAnswer,
        options,
        explanation,
        hints,
        difficulty_level: difficultyLevel,
        order_index: orderIndex
      });
      setSuccess(true);
      setExerciseType('fill_blank');
      setQuestion('');
      setCorrectAnswer('');
      setOptions('');
      setExplanation('');
      setHints('');
      setDifficultyLevel('beginner');
      setOrderIndex('');
      setLessonId('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding exercise');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        Add Exercise
      </Typography>
      {success && <Alert severity="success">Exercise added successfully!</Alert>}
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
        label="Exercise Type"
        value={exerciseType}
        onChange={e => setExerciseType(e.target.value)}
        required
        fullWidth
        margin="normal"
        select
      >
        <MenuItem value="fill_blank">Fill in the Blank</MenuItem>
        <MenuItem value="translate">Translate</MenuItem>
        <MenuItem value="multiple_choice">Multiple Choice</MenuItem>
        <MenuItem value="speaking">Speaking</MenuItem>
      </TextField>
      <TextField
        label="Question"
        value={question}
        onChange={e => setQuestion(e.target.value)}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Correct Answer"
        value={correctAnswer}
        onChange={e => setCorrectAnswer(e.target.value)}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Options (JSON array)"
        value={options}
        onChange={e => setOptions(e.target.value)}
        fullWidth
        margin="normal"
        placeholder='["option1", "option2"]'
      />
      <TextField
        label="Explanation"
        value={explanation}
        onChange={e => setExplanation(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Hints (JSON array)"
        value={hints}
        onChange={e => setHints(e.target.value)}
        fullWidth
        margin="normal"
        placeholder='["hint1", "hint2"]'
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
        Add Exercise
      </Button>
    </Box>
  );
};

export default AddExercise;
