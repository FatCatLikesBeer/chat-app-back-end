import express from 'express';
import { createServer } from 'node:http';

import loginRouter from './routes/loginRouter.js';

const app = express();
const server = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/login', loginRouter);

server.listen(3000, () => {
  console.log("Server running at https://localhost:3000");
});
