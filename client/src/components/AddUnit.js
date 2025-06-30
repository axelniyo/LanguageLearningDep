import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Alert, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';

const AddUnit = () => {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [orderIndex, setOrderIndex] = useState('');
  const [xpReward, setXpReward] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/courses').then(res => {
      setCourses(res.data);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError('');
    try {
      await axios.post('/api/units', { course_id: courseId, name, description, order_index: orderIndex, xp_reward: xpReward });
      setSuccess(true);
      setName('');
      setDescription('');
      setOrderIndex('');
      setXpReward('');
      setCourseId('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding unit');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        Add New Unit
      </Typography>
      {success && <Alert severity="success">Unit added successfully!</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      <FormControl fullWidth margin="normal" required>
        <InputLabel>Course</InputLabel>
        <Select
          value={courseId}
          label="Course"
          onChange={e => setCourseId(e.target.value)}
        >
          {courses.map(course => (
            <MenuItem key={course.id} value={course.id}>{course.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Unit Name"
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
        Add Unit
      </Button>
    </Box>
  );
};

export default AddUnit;
