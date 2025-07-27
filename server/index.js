// index.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { checkToxicity } from './utils/toxicityCheck.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 5000;

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('sendMessage', async ({ username, message }) => {
    const isToxic = await checkToxicity(message);

    if (isToxic) {
      socket.emit('warning', {
        message: `⚠️ Message blocked due to policy violation.`,
      });
    } else {
      io.emit('receiveMessage', { username, message });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
