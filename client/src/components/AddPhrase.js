import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Alert, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';

const AddPhrase = () => {
  const [lessons, setLessons] = useState([]);
  const [lessonId, setLessonId] = useState('');
  const [phrase, setPhrase] = useState('');
  const [translation, setTranslation] = useState('');
  const [pronunciation, setPronunciation] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [context, setContext] = useState('');
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
      await axios.post('/api/phrases', {
        lesson_id: lessonId,
        phrase,
        translation,
        pronunciation,
        audio_url: audioUrl,
        context,
        difficulty_level: difficultyLevel,
        order_index: orderIndex
      });
      setSuccess(true);
      setPhrase('');
      setTranslation('');
      setPronunciation('');
      setAudioUrl('');
      setContext('');
      setDifficultyLevel('beginner');
      setOrderIndex('');
      setLessonId('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding phrase');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        Add Phrase
      </Typography>
      {success && <Alert severity="success">Phrase added successfully!</Alert>}
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
        label="Phrase"
        value={phrase}
        onChange={e => setPhrase(e.target.value)}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Translation"
        value={translation}
        onChange={e => setTranslation(e.target.value)}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Pronunciation"
        value={pronunciation}
        onChange={e => setPronunciation(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Audio URL"
        value={audioUrl}
        onChange={e => setAudioUrl(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Context"
        value={context}
        onChange={e => setContext(e.target.value)}
        fullWidth
        margin="normal"
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
        Add Phrase
      </Button>
    </Box>
  );
};

export default AddPhrase;
