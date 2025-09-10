import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, CssBaseline, Button } from '@mui/material';
import ComputerList from './ComputerList';
import Dashboard from './Dashboard';
import ComputerSettings from './ComputerSettings';

function App() {
  return (
    <Router>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>System Dashboard</Typography>
          <Button color="inherit" component={RouterLink} to="/">Home</Button>
          <Button color="inherit" component={RouterLink} to="/settings">Settings</Button>
        </Toolbar>
      </AppBar>
      <Container>
        <Routes>
          <Route path="/" element={<ComputerList />} />
          <Route path="/dashboard/:systemId" element={<Dashboard />} />
          <Route path="/settings" element={<ComputerSettings />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
