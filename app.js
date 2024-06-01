const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Middleware for authentication
const authMiddleware = require('./middleware/auth');

// Routes
const volcanoRoutes = require('./routes/volcanoes');
const userRoutes = require('./routes/users');
const customRoutes = require('./routes/custom');

// Use Routes
app.use('/', volcanoRoutes);
app.use('/user', userRoutes);
app.use('/api/custom', customRoutes);

// Swagger docs route
app.use('/', swaggerUI.serve);
app.get('/', swaggerUI.setup(swaggerDocument));

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;
