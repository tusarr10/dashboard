// // import React, { useState, useEffect } from 'react';
// // import { Link as RouterLink } from 'react-router-dom';
// // import { List, ListItem, ListItemText, Typography, Button, CircularProgress, Box } from '@mui/material';
// // import { Settings } from '@mui/icons-material';
// // import axios from 'axios';

// // function ComputerList() {
// //   const [systems, setSystems] = useState([]);
// //   const [loading, setLoading] = useState(false);

// //   const fetchSystems = () => {
// //     setLoading(true);
// //     //axios.get('http://localhost:9006/computers') // Fetch from backend API
// //     axios.get(`${computer.apiserver.replace(/\/$/, '')}/system_identifier`)  
// //     .then(response => {
// //         const computers = response.data;
// //         const promises = computers.map(computer =>
// //           axios.get(`${computer.apiserver}/system_identifier`)
// //             .then(res => ({
// //               ...computer,
// //               system_identifier: res.data.system_identifier,
// //               online: true,
// //             }))
// //             .catch(() => ({
// //               ...computer,
// //               system_identifier: 'Offline',
// //               online: false,
// //             }))
// //         );

// //         Promise.all(promises).then(results => {
// //           setSystems(results);
// //           setLoading(false);
// //         });
// //       })
// //       .catch(error => {
// //         console.error('Error fetching computers:', error);
// //         setLoading(false);
// //       });
// //   };

// //   useEffect(() => {
// //     fetchSystems();
// //   }, []);

// //   return (
// //     <div>
// //       <Typography variant="h4" gutterBottom>Select a Computer</Typography>
// //       <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
// //         <Button variant="contained" onClick={fetchSystems} disabled={loading} style={{ marginRight: 10 }}>
// //           {loading ? <CircularProgress size={24} /> : 'Refresh'}
// //         </Button>
// //         <Button variant="contained" color="primary" startIcon={<Settings />} component={RouterLink} to="/settings">
// //           Manage Computers
// //         </Button>
// //       </Box>
// //       <List>
// //         {systems.map(system => (
// //           <ListItem
// //             button
// //             component={system.online ? RouterLink : 'div'}
// //             to={`/dashboard/${system.name}?apiServer=${system.apiserver}`}
// //             key={system.name}
// //             disabled={!system.online}
// //           >
// //             <ListItemText primary={system.name} secondary={system.system_identifier} />
// //             <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: system.online ? 'green' : 'red' }} />
// //           </ListItem>
// //         ))}
// //       </List>
// //     </div>
// //   );
// // }

// // export default ComputerList;
// import React, { useState, useEffect } from 'react';
// import { Link as RouterLink } from 'react-router-dom';
// import { List, ListItem, ListItemText, Typography, Button, CircularProgress, Box } from '@mui/material';
// import { Settings } from '@mui/icons-material';
// import axios from 'axios';

// function ComputerList() {
//   const [systems, setSystems] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchSystems = () => {
//     setLoading(true);

//     // 1️⃣ Fetch list of computers from backend
//     axios.get('http://localhost:9006/computers')
//       .then(response => {
//         const computers = response.data;

//         // 2️⃣ For each computer, fetch its system_identifier
//         const promises = computers.map((computer) =>
//           axios.get(`${computer.apiserver.replace(/\/$/, '')}/system_identifier`)
//             .then(res => ({
//               ...computer,
//               system_identifier: res.data.system_identifier,
//               online: true,
//             }))
//             .catch(() => ({
//               ...computer,
//               system_identifier: 'Offline',
//               online: false,
//             }))
//         );

//         // 3️⃣ Wait for all requests to finish
//         Promise.all(promises).then(results => {
//           setSystems(results);
//           setLoading(false);
//         });
//       })
//       .catch(error => {
//         console.error('Error fetching computers:', error);
//         setLoading(false);
//       });
//   };

//   useEffect(() => {
//     fetchSystems();
//   }, []);

//   return (
//     <div>
//       <Typography variant="h4" gutterBottom>Select a Computer</Typography>

//       <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
//         <Button variant="contained" onClick={fetchSystems} disabled={loading} style={{ marginRight: 10 }}>
//           {loading ? <CircularProgress size={24} /> : 'Refresh'}
//         </Button>

//         <Button
//           variant="contained"
//           color="primary"
//           startIcon={<Settings />}
//           component={RouterLink}
//           to="/settings"
//         >
//           Manage Computers
//         </Button>
//       </Box>

//       <List>
//         {systems.map(system => (
//           <ListItem
//             button
//             component={system.online ? RouterLink : 'div'}
//             to={`/dashboard/${system.name}?apiServer=${system.apiserver}`}
//             key={system.name}
//             disabled={!system.online}
//           >
//             <ListItemText primary={system.name} secondary={system.system_identifier} />
//             <div
//               style={{
//                 width: 10,
//                 height: 10,
//                 borderRadius: '50%',
//                 backgroundColor: system.online ? 'green' : 'red'
//               }}
//             />
//           </ListItem>
//         ))}
//       </List>
//     </div>
//   );
// }

// export default ComputerList;


import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { List, ListItem, ListItemText, Typography, Button, CircularProgress, Box } from '@mui/material';
import { Settings } from '@mui/icons-material';
import axios from 'axios';

function ComputerList() {
  const [systems, setSystems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSystems = () => {
    setLoading(true);

    // Fetch list of computers from backend
    axios.get('http://localhost:9006/computers')
      .then(response => {
        const computers = response.data;

        // For each computer, fetch its system_identifier
        const promises = computers.map((computer) => {
          // Normalize apiserver (remove trailing slash)
          const cleanApiServer = computer.apiserver.replace(/\/$/, '');

          return axios.get(`${cleanApiServer}/system_identifier`)
            .then(res => ({
              ...computer,
              apiserver: cleanApiServer, // ✅ store cleaned version
              system_identifier: res.data.system_identifier,
              online: true,
            }))
            .catch(() => ({
              ...computer,
              apiserver: cleanApiServer, // ✅ store cleaned version
              system_identifier: 'Offline',
              online: false,
            }));
        });

        Promise.all(promises).then(results => {
          setSystems(results);
          setLoading(false);
        });
      })
      .catch(error => {
        console.error('Error fetching computers:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSystems();
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>Select a Computer</Typography>

      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Button
          variant="contained"
          onClick={fetchSystems}
          disabled={loading}
          style={{ marginRight: 10 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Refresh'}
        </Button>

        <Button
          variant="contained"
          color="primary"
          startIcon={<Settings />}
          component={RouterLink}
          to="/settings"
        >
          Manage Computers
        </Button>
      </Box>

      <List>
        {systems.map(system => (
          <ListItem
            button
            component={system.online ? RouterLink : 'div'}
            to={`/dashboard/${system.name}?apiServer=${system.apiserver}`} // ✅ now always without trailing /
            key={system.name}
            disabled={!system.online}
          >
            <ListItemText primary={system.name} secondary={system.system_identifier} />
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: system.online ? 'green' : 'red'
              }}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default ComputerList;
