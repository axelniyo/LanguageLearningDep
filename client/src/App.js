import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, CssBaseline, Drawer, List, ListItem, ListItemText, Toolbar, AppBar, Typography, Box } from '@mui/material';
import AddLanguage from './components/AddLanguage';
import AddCourse from './components/AddCourse';
import AddUnit from './components/AddUnit';
import AddLesson from './components/AddLesson';
import AddVocabulary from './components/AddVocabulary';
import AddGrammar from './components/AddGrammar';
import AddPhrase from './components/AddPhrase';
import AddExercise from './components/AddExercise';

// Global fetch lock
let isDataFetched = false;

const drawerWidth = 240;

function App() {
  const [languages, setLanguages] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data once with proper API endpoints
useEffect(() => {
  if (!isDataFetched) {
    isDataFetched = true;
    setLoading(true);
    setError(null); // Reset errors on retry
    
    const API_BASE = 'https://languagelearningdep.onrender.com';
    const cacheBuster = `?t=${Date.now()}`; // Prevents caching issues

    Promise.all([
      fetch(`${API_BASE}/api/languages${cacheBuster}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }).then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Languages fetch failed');
        }
        return data;
      }),
      fetch(`${API_BASE}/api/courses${cacheBuster}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }).then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Courses fetch failed');
        }
        return data;
      })
    ])
    .then(([langData, courseData]) => {
      console.log('API Response - Languages:', langData); // Debug log
      console.log('API Response - Courses:', courseData); // Debug log
      setLanguages(langData);
      setCourses(courseData);
    })
    .catch(error => {
      console.error('API Error:', error);
      setError(error.message);
      isDataFetched = false; // Allow retry
    })
    .finally(() => {
      setLoading(false);
    });
  }
}, []);

  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              Language Course Admin
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <List>
              <ListItem button component={Link} to="/add-language">
                <ListItemText primary="Add Language" />
              </ListItem>
              <ListItem button component={Link} to="/add-course">
                <ListItemText primary="Add Course" />
              </ListItem>
              <ListItem button component={Link} to="/add-unit">
                <ListItemText primary="Add Unit" />
              </ListItem>
              <ListItem button component={Link} to="/add-lesson">
                <ListItemText primary="Add Lesson" />
              </ListItem>
              <ListItem button component={Link} to="/add-vocabulary">
                <ListItemText primary="Add Vocabulary" />
              </ListItem>
              <ListItem button component={Link} to="/add-grammar">
                <ListItemText primary="Add Grammar" />
              </ListItem>
              <ListItem button component={Link} to="/add-phrase">
                <ListItemText primary="Add Phrase" />
              </ListItem>
              <ListItem button component={Link} to="/add-exercise">
                <ListItemText primary="Add Exercise" />
              </ListItem>
            </List>
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Container maxWidth="md">
            {error ? (
              <Typography color="error">Error: {error}</Typography>
            ) : loading ? (
              <Typography variant="h6">Loading data...</Typography>
            ) : (
              <Routes>
                <Route path="/add-language" element={<AddLanguage languages={languages} />} />
                <Route path="/add-course" element={<AddCourse courses={courses} languages={languages} />} />
                <Route path="/add-unit" element={<AddUnit courses={courses} />} />
                <Route path="/add-lesson" element={<AddLesson />} />
                <Route path="/add-vocabulary" element={<AddVocabulary />} />
                <Route path="/add-grammar" element={<AddGrammar />} />
                <Route path="/add-phrase" element={<AddPhrase />} />
                <Route path="/add-exercise" element={<AddExercise />} />
                <Route path="*" element={
                  <div>
                    <Typography variant="h5">Welcome to the Language Course Admin UI!</Typography>
                    <Typography variant="subtitle1">Available Languages: {languages.length}</Typography>
                    <Typography variant="subtitle1">Available Courses: {courses.length}</Typography>
                  </div>
                } />
              </Routes>
            )}
          </Container>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
