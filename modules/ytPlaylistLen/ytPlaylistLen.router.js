const express = require('express');
const controller = require('./ytPlaylistLen.controller.js');

const router = express.Router();

router.post('/', controller.getPlaylistData);

module.exports = router;
