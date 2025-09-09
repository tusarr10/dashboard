import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Grid, Typography, Tab, Tabs } from '@mui/material';
import axios from 'axios';
import SystemInfo from './SystemInfo';
import Progress from './Progress';
import Found from './Found';
import Config from './Config';
import TelegramLog from './TelegramLog';
import BloomCard from './BloomCard';
import InitCard from './InitCard';
import LoadCard from './LoadCard';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Dashboard() {
  const { systemId } = useParams();
  const query = useQuery();
  const apiServer = query.get('apiServer');
  const [data, setData] = useState(null);
  const [systemIdentifier, setSystemIdentifier] = useState(systemId);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    axios.get(`${apiServer}/data`)
      .then(response => {
        setData(response.data);
        setSystemIdentifier(response.data.system_identifier);
      })
      .catch(error => {
        console.error(`Error fetching data for ${systemId}:`, error);
      });
  }, [systemId, apiServer]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (!data) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>Dashboard for {systemIdentifier}</Typography>
      <Tabs value={tabValue} onChange={handleTabChange}>
        <Tab label="Dashboard" />
        <Tab label="Found" />
        <Tab label="Config" />
        <Tab label="Telegram Log" />
      </Tabs>

      {tabValue === 0 && (
        <Grid container spacing={3} style={{ marginTop: 20 }}>
          <Grid item xs={12}>
            <SystemInfo apiServer={apiServer} />
          </Grid>
          <Grid item xs={12}>
            <Progress apiServer={apiServer} />
          </Grid>
          <Grid item xs={12}>
            <BloomCard apiServer={apiServer} />
          </Grid>
          <Grid item xs={12}>
            <InitCard apiServer={apiServer} />
          </Grid>
          <Grid item xs={12}>
            <LoadCard apiServer={apiServer} />
          </Grid>
        </Grid>
      )}

      {tabValue === 1 && (
        <Found found={data.found} />
      )}

      {tabValue === 2 && (
        <Config apiServer={apiServer} />
      )}

      {tabValue === 3 && (
        <TelegramLog apiServer={apiServer} />
      )}
    </div>
  );
}

export default Dashboard;