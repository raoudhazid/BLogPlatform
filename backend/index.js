const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
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

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());


require("./startup/routes")(app);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`UserService running on port ${PORT} with Swagger at /api-docs`));