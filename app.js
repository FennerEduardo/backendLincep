require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./database/db');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const apiRouter = require('./routes/api')
const port = process.env.PORT;
require('./schedule/tokenCleanup');

// Middlewares
// Analizar application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Analizar application/json
app.use(bodyParser.json());

// Rutas de autenticación
app.use('/auth', authRoutes);

// Rutas
app.use('/api', apiRouter);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})