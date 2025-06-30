import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Alert, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';

const AddLesson = () => {
  const [units, setUnits] = useState([]);
  const [unitId, setUnitId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [lessonType, setLessonType] = useState('vocabulary');
  const [orderIndex, setOrderIndex] = useState('');
  const [xpReward, setXpReward] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/units').then(res => {
      setUnits(res.data);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError('');
    try {
      await axios.post('/api/lessons', { unit_id: unitId, name, description, lesson_type: lessonType, order_index: orderIndex, xp_reward: xpReward });
      setSuccess(true);
      setName('');
      setDescription('');
      setOrderIndex('');
      setXpReward('');
      setUnitId('');
      setLessonType('vocabulary');
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding lesson');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        Add New Lesson
      </Typography>
      {success && <Alert severity="success">Lesson added successfully!</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      <FormControl fullWidth margin="normal" required>
        <InputLabel>Unit</InputLabel>
        <Select
          value={unitId}
          label="Unit"
          onChange={e => setUnitId(e.target.value)}
        >
          {units.map(unit => (
            <MenuItem key={unit.id} value={unit.id}>{unit.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Lesson Name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Lesson Type"
        value={lessonType}
        onChange={e => setLessonType(e.target.value)}
        required
        fullWidth
        margin="normal"
        select
      >
        <MenuItem value="vocabulary">Vocabulary</MenuItem>
        <MenuItem value="grammar">Grammar</MenuItem>
        <MenuItem value="phrases">Phrases</MenuItem>
        <MenuItem value="exercises">Exercises</MenuItem>
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
      <TextField
        label="XP Reward"
        value={xpReward}
        onChange={e => setXpReward(e.target.value)}
        required
        fullWidth
        margin="normal"
        type="number"
      />
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Add Lesson
      </Button>
    </Box>
  );
};

export default AddLesson;
