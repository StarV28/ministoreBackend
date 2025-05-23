import express from 'express';
import routes from './src/v1/routes/index.mjs';
import connect from './db/connectdb.mjs';
import middleware from './middleware/index.mjs';
import errorHandler from './middleware/errorHandler.mjs';

const app = express();

// Connect middleware
middleware(app);
// Connect Routers
app.use('/api/v1/', routes);
// Error handling middleware
errorHandler(app);

export default app;
