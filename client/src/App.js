import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { 
  Container, 
  CssBaseline, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  Toolbar, 
  AppBar, 
  Typography, 
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button
} from '@mui/material';
import AddLanguage from './components/AddLanguage';
import AddCourse from './components/AddCourse';
import AddUnit from './components/AddUnit';
import AddLesson from './components/AddLesson';
import AddVocabulary from './components/AddVocabulary';
import AddGrammar from './components/AddGrammar';
import AddPhrase from './components/AddPhrase';
import AddExercise from './components/AddExercise';

const drawerWidth = 240;

// API base URL from environment variables
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function App() {
  const [languages, setLanguages] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch languages
        const langRes = await fetch(`${API_URL}/api/languages`);
        const langData = await langRes.json();
        setLanguages(langData);

        // Fetch courses
        const coursesRes = await fetch(`${API_URL}/api/courses`);
        const coursesData = await coursesRes.json();
        setCourses(coursesData);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please check the console for details.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refreshData = async () => {
    try {
      setLoading(true);
      const [langRes, coursesRes] = await Promise.all([
        fetch(`${API_URL}/api/languages`),
        fetch(`${API_URL}/api/courses`)
      ]);
      
      const [langData, coursesData] = await Promise.all([
        langRes.json(),
        coursesRes.json()
      ]);
      
      setLanguages(langData);
      setCourses(coursesData);
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  const DataTable = ({ title, data, columns }) => (
    <Paper sx={{ margin: '20px 0', padding: '20px' }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.key}><strong>{col.label}</strong></TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                {columns.map((col) => (
                  <TableCell key={`${index}-${col.key}`}>
                    {typeof col.render === 'function' ? col.render(row) : row[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );

  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Language Learning Admin
            </Typography>
            <Button color="inherit" onClick={refreshData} disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Refresh Data'}
            </Button>
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
          <Container>
            {error && (
              <Paper sx={{ padding: 2, marginBottom: 2, backgroundColor: '#ffebee' }}>
                <Typography color="error">{error}</Typography>
              </Paper>
            )}
            
            <Routes>
              <Route path="/add-language" element={<AddLanguage onAdd={refreshData} />} />
              <Route path="/add-course" element={<AddCourse onAdd={refreshData} />} />
              <Route path="/add-unit" element={<AddUnit onAdd={refreshData} />} />
              <Route path="/add-lesson" element={<AddLesson onAdd={refreshData} />} />
              <Route path="/add-vocabulary" element={<AddVocabulary onAdd={refreshData} />} />
              <Route path="/add-grammar" element={<AddGrammar onAdd={refreshData} />} />
              <Route path="/add-phrase" element={<AddPhrase onAdd={refreshData} />} />
              <Route path="/add-exercise" element={<AddExercise onAdd={refreshData} />} />
              <Route path="/" element={
                <div>
                  <Typography variant="h4" gutterBottom>Language Learning Dashboard</Typography>
                  
                  {loading ? (
                    <Box display="flex" justifyContent="center" my={4}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <>
                      <DataTable 
                        title="Languages" 
                        data={languages} 
                        columns={[
                          { key: 'id', label: 'ID' },
                          { key: 'name', label: 'Name' },
                          { key: 'code', label: 'Code' },
                          { 
                            key: 'created_at', 
                            label: 'Created At',
                            render: (item) => new Date(item.created_at).toLocaleDateString()
                          }
                        ]} 
                      />

                      <DataTable 
                        title="Courses" 
                        data={courses} 
                        columns={[
                          { key: 'id', label: 'ID' },
                          { key: 'language_id', label: 'Language ID' },
                          { key: 'title', label: 'Title' },
                          { key: 'level', label: 'Level' },
                          { 
                            key: 'created_at', 
                            label: 'Created At',
                            render: (item) => new Date(item.created_at).toLocaleDateString()
                          }
                        ]} 
                      />
                    </>
                  )}
                </div>
              } />
            </Routes>
          </Container>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
