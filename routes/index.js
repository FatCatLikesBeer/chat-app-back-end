var express = require('express');
var router = express.Router();
const { Server } from "socket.io";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ title: 'Express' });
});

module.exports = router;
