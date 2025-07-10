
let isDataFetched = false; // Global flag

function App() {
  const [languages, setLanguages] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (!isDataFetched) { // Only fetch if not already done
      isDataFetched = true;
      fetch('/languages').then(res => res.json()).then(setLanguages);
      fetch('/courses').then(res => res.json()).then(setCourses);
    }
  }, []);

  // ... (rest of your code)
}
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

const drawerWidth = 240;

function App() {
  const [languages, setLanguages] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch data once when app loads
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('/languages').then(res => res.json()),
      fetch('/courses').then(res => res.json())
    ])
    .then(([langData, courseData]) => {
      setLanguages(langData);
      setCourses(courseData);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      setLoading(false);
    });
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
            {loading ? (
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
