require('./config/env')();
const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { notFoundHandler, errorHandler } = require('./api/middleware/gutterMiddlewares');
const { handleGracefulShutdown } = require('./utils/gracefulShutdown');
const { isProd } = require('./utils/helpers');
const { generalLimiter } = require('../src/utils/rateLimitUtil');
const connectDB = require('./config/db');

const app = express();

app.use(generalLimiter);
app.use(require('./api/middleware/responseLib'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// MongoDB connection
connectDB();

// API routes
app.use('/api', require('./api/routes'));

// Serve static assets in production
if (isProd) {
  const appBasePath = path.dirname(process.cwd());
  app.use(express.static(path.join(appBasePath, 'client', 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(appBasePath, 'client', 'dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

app.use(notFoundHandler);
app.use(errorHandler);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Server running on port ${port}`));

handleGracefulShutdown(server);

module.exports = app;