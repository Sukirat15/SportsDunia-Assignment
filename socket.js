// socket.js
let io = null;

module.exports = {
  initSocket: server => {
    const { Server } = require('socket.io');
    io = new Server(server, { cors: { origin: '*' } });
    io.on('connection', socket => {
      console.log('🟢 Socket client connected:', socket.id);
      socket.on('disconnect', () => console.log('🔴 Socket client disconnected:', socket.id));
    });
    return io;
  },

  getIo: () => {
    if (!io) throw new Error('Socket.io has not been initialized yet');
    return io;
  }
};
