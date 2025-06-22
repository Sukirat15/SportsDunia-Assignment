// index.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const router = require('./routes/routes');
const { initSocket } = require('./socket');

const app = express();
app.use(cors());
app.use(express.json());

// **REQUEST LOGGER** – so you can see “POST /register” in your console
app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.url}`);
  next();
});

app.use(router);

const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 3000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

server.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
