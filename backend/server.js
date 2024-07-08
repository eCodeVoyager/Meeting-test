const express = require("express");
const http = require("http");
const socket = require("socket.io");
const { ExpressPeerServer } = require("peer");

const app = express();
const server = http.createServer(app);
const io = socket(server, {
  cors: {
    origin: "*",
  },
});

// Separate server for PeerServer
const peerApp = express();
const peerServer = http.createServer(peerApp);
const peerPort = 3001; // Different port for PeerServer
const peer = ExpressPeerServer(peerServer, {
  debug: true,
});

peerApp.use("/peerjs", peer);

io.on("connection", (socket) => {
  console.log("New socket connection:", socket.id);

  socket.on("join-room", (roomId, userId) => {
    if (!roomId || !userId) {
      console.error("Invalid roomId or userId:", roomId, userId);
      return;
    }

    console.log(`User ${userId} joining room ${roomId}`);
    socket.join(roomId);

    socket.to(roomId).emit("user-connected", userId);

    socket.on("disconnect", () => {
      console.log(`User ${userId} disconnected from room ${roomId}`);
      socket.to(roomId).emit("user-disconnected", userId);
    });
  });
});

app.get("/", (req, res) => {
  res.send("Main server is running");
});

// Start the main server
server.listen(3000, "0.0.0.0", () => {
  console.log("Main server is running on port 3000");
});

// Start the PeerServer on a different port
peerServer.listen(peerPort, () => {
  console.log(`Peer server is running on port ${peerPort}`);
});
