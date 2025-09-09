import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, CssBaseline } from '@mui/material';
import ComputerList from './ComputerList';
import Dashboard from './Dashboard';

function App() {
  return (
    <Router>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">System Dashboard</Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Routes>
          <Route path="/" element={<ComputerList />} />
          <Route path="/dashboard/:systemId" element={<Dashboard />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;