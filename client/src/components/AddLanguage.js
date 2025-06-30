import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';
import axios from 'axios';

const AddLanguage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError('');
    try {
      await axios.post('/api/languages', { name, description });
      setSuccess(true);
      setName('');
      setDescription('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding language');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        Add New Language
      </Typography>
      {success && <Alert severity="success">Language added successfully!</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        label="Language Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Add Language
      </Button>
    </Box>
  );
};

export default AddLanguage;
