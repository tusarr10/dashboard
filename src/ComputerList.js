import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemText, Typography, Button, CircularProgress } from '@mui/material';
import axios from 'axios';

function ComputerList() {
  const [systems, setSystems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSystems = () => {
    setLoading(true);
    fetch('/computers.json')
      .then(response => response.json())
      .then(computers => {
        const promises = computers.map(computer =>
          axios.get(`${computer.apiserver}/system_identifier`)
            .then(response => ({
              ...computer,
              system_identifier: response.data.system_identifier,
              online: true,
            }))
            .catch(() => ({
              ...computer,
              system_identifier: 'Offline',
              online: false,
            }))
        );

        Promise.all(promises).then(results => {
          setSystems(results);
          setLoading(false);
        });
      })
      .catch(error => {
        console.error('Error fetching computers.json:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSystems();
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>Select a Computer</Typography>
      <Button variant="contained" onClick={fetchSystems} disabled={loading}>
        {loading ? <CircularProgress size={24} /> : 'Refresh'}
      </Button>
      <List>
        {systems.map(system => (
          <ListItem
            button
            component={system.online ? Link : 'div'}
            to={`/dashboard/${system.name}?apiServer=${system.apiserver}`}
            key={system.name}
            disabled={!system.online}
          >
            <ListItemText primary={system.name} secondary={system.system_identifier} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: system.online ? 'green' : 'red' }} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default ComputerList;