const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*"
  }
});

app.use(cors());
app.use(express.json());

let latestData = { temperature: "--", humidity: "--" };

// Serve simple HTML page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Receive data from ESP32
app.post('/data', (req, res) => {
  latestData = req.body;
  console.log("Received from ESP32:", latestData);

  // Broadcast to all clients
  io.emit("update", latestData);

  res.sendStatus(200);
});

// Serve live updates via WebSocket
io.on("connection", (socket) => {
  console.log("Client connected");
  socket.emit("update", latestData);
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

const cors = require('cors');
app.use(cors()); // Allow all origins


// Receive data from ESP32
app.post('/data', (req, res) => {
  latestData = req.body;
  console.log("Received from ESP32:", latestData);
  io.emit("update", latestData);
  res.sendStatus(200);
});

// 🔧 Add this GET route
app.get('/data', (req, res) => {
  res.json(latestData);
});

