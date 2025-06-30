import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Alert, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';

const AddCourse = () => {
  const [languages, setLanguages] = useState([]);
  const [languageId, setLanguageId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState('beginner');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/languages').then(res => {
      setLanguages(res.data);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError('');
    try {
      await axios.post('/api/courses', { language_id: languageId, name, description, level });
      setSuccess(true);
      setName('');
      setDescription('');
      setLevel('beginner');
      setLanguageId('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding course');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        Add New Course
      </Typography>
      {success && <Alert severity="success">Course added successfully!</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      <FormControl fullWidth margin="normal" required>
        <InputLabel>Language</InputLabel>
        <Select
          value={languageId}
          label="Language"
          onChange={e => setLanguageId(e.target.value)}
        >
          {languages.map(lang => (
            <MenuItem key={lang.id} value={lang.id}>{lang.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Course Name"
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
        label="Level"
        value={level}
        onChange={e => setLevel(e.target.value)}
        required
        fullWidth
        margin="normal"
        select
      >
        <MenuItem value="beginner">Beginner</MenuItem>
        <MenuItem value="intermediate">Intermediate</MenuItem>
        <MenuItem value="advanced">Advanced</MenuItem>
      </TextField>
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Add Course
      </Button>
    </Box>
  );
};

export default AddCourse;
