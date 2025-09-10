const express = require("express");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");

const app = express();
const PORT = 9006;

// Base directory (same for all files)
//const BASE_PATH = __dirname;
const BASE_PATH = "C:\\Users\\USER\\source\\Software\\Cuda";

// Individual files
const STATUS_FILE   = path.join(BASE_PATH, "status.json");
const CONFIG_FILE   = path.join(BASE_PATH, "config.json");
const TELEGRAM_FILE = path.join(BASE_PATH, "telegramstatus.json");
const COMPUTERS_FILE = path.join(BASE_PATH, "computers.json");

// =============== Helpers ===============
function readJsonFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') { // File not found
      return [];
    }
    console.error(`Error reading ${filePath}:`, err.message);
    return null;
  }
}

function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error(`Error writing to ${filePath}:`, err.message);
    return false;
  }
}
const cors = require("cors");

// Allow requests from your React frontend
app.use(cors({
  origin: "http://localhost:9000", // <-- your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"]
}));


app.use(express.json());


function getSystemData() {
  const data = readJsonFile(STATUS_FILE);
  if (!data || !data.systems) throw new Error("Invalid status.json format");
  const systemIdentifier = Object.keys(data.systems)[0];
  return { systemIdentifier, systemData: data.systems[systemIdentifier] };
}

function getConfigData() {
  return readJsonFile(CONFIG_FILE);
}

function getTelegramStatusData() {
  return readJsonFile(TELEGRAM_FILE);
}

function getComputersData() {
  return readJsonFile(COMPUTERS_FILE);
}

// =============== REST Endpoints ===============
app.get("/system_identifier", (req, res) => {
  try {
    const computers = getComputersData();
    res.json(computers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/data", (req, res) => {
  try {
    const { systemIdentifier, systemData } = getSystemData();
    res.json({ system_identifier: systemIdentifier, ...systemData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/bloom", (req, res) => {
  try {
    const { systemData } = getSystemData();
    res.json(systemData.bloom);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/found", (req, res) => {
  try {
    const { systemData } = getSystemData();
    res.json(systemData.found);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/found/:id", (req, res) => {
  try {
    const { systemData } = getSystemData();
    const foundItem = systemData.found.find(f => f.id === parseInt(req.params.id));
    if (foundItem) res.json(foundItem);
    else res.status(404).json({ error: "Not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/init", (req, res) => {
  try {
    const { systemData } = getSystemData();
    res.json(systemData.init);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/load", (req, res) => {
  try {
    const { systemData } = getSystemData();
    res.json(systemData.load);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/progress", (req, res) => {
  try {
    const { systemData } = getSystemData();
    res.json(systemData.progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/system", (req, res) => {
  try {
    const { systemData } = getSystemData();
    res.json(systemData.system);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= Config.json API =================
app.get("/config", (req, res) => {
  try {
    res.json(getConfigData());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/config", (req, res) => {
  const newConfig = req.body;
  if (writeJsonFile(CONFIG_FILE, newConfig)) {
    res.json({ message: "Config updated successfully" });
  } else {
    res.status(500).json({ error: "Failed to update config" });
  }
});

// API for computers.json
app.get("/computers", (req, res) => {
  try {
    res.json(getComputersData());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/computers", (req, res) => {
  try {
    const computers = getComputersData();
    const newComputer = req.body;
    computers.push(newComputer);
    if (writeJsonFile(COMPUTERS_FILE, computers)) {
      res.status(201).json({ message: "Computer added successfully" });
    } else {
      res.status(500).json({ error: "Failed to add computer" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/computers/:name", (req, res) => {
  try {
    let computers = getComputersData();
    const { name } = req.params;
    const updatedComputer = req.body;
    const index = computers.findIndex(c => c.name === name);
    if (index !== -1) {
      computers[index] = updatedComputer;
      if (writeJsonFile(COMPUTERS_FILE, computers)) {
        res.json({ message: "Computer updated successfully" });
      } else {
        res.status(500).json({ error: "Failed to update computer" });
      }
    } else {
      res.status(404).json({ error: "Computer not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/computers/:name", (req, res) => {
  try {
    let computers = getComputersData();
    const { name } = req.params;
    const filteredComputers = computers.filter(c => c.name !== name);
    if (filteredComputers.length < computers.length) {
      if (writeJsonFile(COMPUTERS_FILE, filteredComputers)) {
        res.json({ message: "Computer deleted successfully" });
      } else {
        res.status(500).json({ error: "Failed to delete computer" });
      }
    } else {
      res.status(404).json({ error: "Computer not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= Telegram Status API =================
app.get("/telegramstatus", (req, res) => {
  try {
    res.json(getTelegramStatusData());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Dummy Data for /serverstatus
app.get("/serverstatus", (req, res) => {
  try {
    res.json({
      status: "Running",
      message: "Server is operational.",
      uptime: "2 days, 5 hours, 30 minutes",
      cpu_usage: "15%",
      memory_usage: "40%"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= Endpoint List =================
app.get("/endpoints", (req, res) => {
  const endpoints = {
    rest: {
      system_identifier: "/system_identifier",
      data: "/data",
      bloom: "/bloom",
      found: "/found",
      found_by_id: "/found/:id",
      init: "/init",
      load: "/load",
      progress: "/progress",
      system: "/system",
      config: "/config",
      telegramstatus: "/telegramstatus"
    },
    live: {
      sse_system: "/live/system",
      sse_progress: "/live/progress",
      websocket_system: "ws://localhost:4005"
    }
  };
  res.json(endpoints);
});

// =============== SSE Live System ===============
app.get("/live/system", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*"); // <-- allow your frontend

  const interval = setInterval(() => {
    try {
      const { systemData } = getSystemData();
      res.write(`data: ${JSON.stringify(systemData.system)}\n\n`);
    } catch (err) {
      res.write(`event: error\ndata: ${err.message}\n\n`);
    }
  }, 2000);

  req.on("close", () => clearInterval(interval));
});

// ================= SSE (Live progress data) =================
app.get("/live/progress", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");

  const interval = setInterval(() => {
    try {
      const { systemData } = getSystemData();
      res.write(`data: ${JSON.stringify(systemData.progress)}\n\n`);
    } catch (err) {
      res.write(`event: error\ndata: ${err.message}\n\n`);
    }
  }, 2000);

  req.on("close", () => clearInterval(interval));
});

// =============== WebSocket Live System ===============
const WS_PORT = 9005;
const wss = new WebSocket.Server({ port: WS_PORT });

wss.on("connection", ws => {
  console.log("WebSocket client connected for system data");

  const interval = setInterval(() => {
    try {
      const { systemData } = getSystemData();
      ws.send(JSON.stringify(systemData.system));
    } catch (err) {
      ws.send(JSON.stringify({ error: err.message }));
    }
  }, 2000);

  ws.on("close", () => clearInterval(interval));
});
// ================= WebSocket (Live progress data) =================
wss.on("connection", ws => {
  console.log("WebSocket client connected");

  const interval = setInterval(() => {
    try {
      const { systemData } = getSystemData();
      ws.send(JSON.stringify({
        system: systemData.system,
        progress: systemData.progress   // << include progress
      }));
    } catch (err) {
      ws.send(JSON.stringify({ error: err.message }));
    }
  }, 2000);

  ws.on("close", () => clearInterval(interval));
});

// =============== Start Server ===============
app.listen(PORT, () => {
  console.log(`HTTP API running at http://localhost:${PORT}`);
  console.log(`SSE live system at http://localhost:${PORT}/live/system`);
  console.log(`WebSocket system live at ws://localhost:${WS_PORT}`);
});

