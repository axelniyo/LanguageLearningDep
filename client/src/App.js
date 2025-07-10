import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, CssBaseline, Drawer, List, ListItem, ListItemText, Toolbar, AppBar, Typography, Box } from '@mui/material';
// Import your components...

// Global fetch lock (solution to duplicates)
let isDataFetched = false;

const drawerWidth = 240;

function App() {
  const [languages, setLanguages] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Nuclear option to prevent duplicates
  useEffect(() => {
    if (!isDataFetched) {
      isDataFetched = true;
      setLoading(true);
      
      Promise.all([
        fetch('/languages').then(res => {
          if (!res.ok) throw new Error('Languages fetch failed');
          return res.json();
        }),
        fetch('/courses').then(res => {
          if (!res.ok) throw new Error('Courses fetch failed');
          return res.json();
        })
      ])
      .then(([langData, courseData]) => {
        setLanguages(langData);
        setCourses(courseData);
      })
      .catch(error => {
        console.error('Fetch error:', error);
        // Optional: Retry logic here if needed
      })
      .finally(() => setLoading(false));
    }
  }, []);

  return (
    <Router>
      {/* Your existing UI remains unchanged */}
      <Box sx={{ display: 'flex' }}>
        {/* ... (keep all your Material-UI code exactly as is) ... */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Container maxWidth="md">
            {loading ? (
              <Typography variant="h6">Loading data...</Typography>
            ) : (
              <Routes>
                {/* Pass data to all components that might need it */}
                <Route path="/add-language" element={<AddLanguage languages={languages} />} />
                <Route path="/add-course" element={<AddCourse courses={courses} languages={languages} />} />
                <Route path="/add-unit" element={<AddUnit courses={courses} />} />
                {/* Other routes remain unchanged */}
              </Routes>
            )}
          </Container>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
