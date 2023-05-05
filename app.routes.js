const express = require('express');
const indexRouter = require('./modules/index.router.js');

function appRoutes(app) {
  app.use(express.json());
  app.use('/', indexRouter.ytPlaylistLenRouter);
}

module.exports = appRoutes;
