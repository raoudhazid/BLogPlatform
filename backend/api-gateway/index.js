const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const { createServer } = require('http');
const { Server } = require('socket.io');
let app = express();

app.use(cors({ origin: 'http://localhost:4200' })); // Allow Angular frontend
app.use(express.json());

// Rate Limiting for DDoS Protection
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Limit each IP to 100 requests
});
app.use(limiter);
dotenv.config();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
  },
});


// Middleware
app.use(cors());
app.use(express.json());

// Make io accessible to routes
app.set('socketio', io);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join article room
  socket.on('joinArticle', (articleId) => {
    socket.join(`article:${articleId}`);
    console.log(`User ${socket.id} joined article:${articleId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`UserService running on port ${PORT} with Swagger at /api-docs`));