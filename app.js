require('dotenv').config({ path: '.env' });
const express = require('express');
const runningCors = require('./services/cors.js');
const appRoutes = require('./app.routes.js');

const port = process.env.PORT;
const app = express();

runningCors(app);
appRoutes(app);

app.listen(port, () => {
  console.log('running......', port);
});
