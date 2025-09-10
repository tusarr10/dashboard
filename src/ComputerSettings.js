import React, { useState, useEffect } from 'react';
import { Paper, Typography, Button, Grid, TextField, Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';

const ComputerSettings = () => {
  const [computers, setComputers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentComputer, setCurrentComputer] = useState({ name: '', apiserver: '' });
  const [isEditing, setIsEditing] = useState(false);

  const fetchComputers = () => {
    axios.get('http://localhost:9006/computers') // Assuming the main server runs on 9006
      .then(response => {
        setComputers(response.data);
      })
      .catch(error => {
        console.error('Error fetching computers:', error);
        alert('Error fetching computers');
      });
  };

  useEffect(() => {
    fetchComputers();
  }, []);

  const handleOpenDialog = (computer = { name: '', apiserver: '' }, editing = false) => {
    setCurrentComputer(computer);
    setIsEditing(editing);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentComputer({ name: '', apiserver: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentComputer(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (isEditing) {
      axios.put(`http://localhost:9006/computers/${currentComputer.name}`, currentComputer)
        .then(() => {
          alert('Computer updated successfully!');
          fetchComputers();
          handleCloseDialog();
        })
        .catch(error => {
          console.error('Error updating computer:', error);
          alert('Error updating computer');
        });
    } else {
      axios.post('http://localhost:9006/computers', currentComputer)
        .then(() => {
          alert('Computer added successfully!');
          fetchComputers();
          handleCloseDialog();
        })
        .catch(error => {
          console.error('Error adding computer:', error);
          alert('Error adding computer');
        });
    }
  };

  const handleDelete = (name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      axios.delete(`http://localhost:9006/computers/${name}`)
        .then(() => {
          alert('Computer deleted successfully!');
          fetchComputers();
        })
        .catch(error => {
          console.error('Error deleting computer:', error);
          alert('Error deleting computer');
        });
    }
  };

  return (
    <Paper style={{ padding: 20 }}>
      <Typography variant="h6" gutterBottom>Manage Computers</Typography>
      <Box mb={2}>
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => handleOpenDialog()}>Add New Computer</Button>
      </Box>
      <Grid container spacing={2}>
        {computers.map(computer => (
          <Grid item xs={12} sm={6} md={4} key={computer.name}>
            <Card>
              <CardContent>
                <Typography variant="h6">{computer.name}</Typography>
                <Typography variant="body2" color="textSecondary">API Server: {computer.apiserver}</Typography>
                <Box mt={2}>
                  <IconButton color="primary" onClick={() => handleOpenDialog(computer, true)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDelete(computer.name)}>
                    <Delete />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{isEditing ? 'Edit Computer' : 'Add New Computer'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Computer Name"
            type="text"
            fullWidth
            value={currentComputer.name}
            onChange={handleChange}
            disabled={isEditing} // Name cannot be changed when editing
          />
          <TextField
            margin="dense"
            name="apiserver"
            label="API Server URL"
            type="text"
            fullWidth
            value={currentComputer.apiserver}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
          <Button onClick={handleSubmit} color="primary">{isEditing ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ComputerSettings;
