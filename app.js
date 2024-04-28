const express = require('express');
const { createServer } = require('node:http');

const loginRouter = require('./routes/loginRouter.js');

const app = express();
const server = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/login', loginRouter);

server.listen(3000, () => {
  console.log("Server running at https://localhost:3000");
});
