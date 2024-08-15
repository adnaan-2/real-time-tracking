const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  socket.on("send-location", function(data){
    io.emit("recieve-location", {id: socket.id, ...data});
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    io.emit("user-disconnected", socket.id);
  });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
