// app.js
const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const db = require('.//database/db');


const app = express();
app.use(bodyParser.json());

// Resto de tu código para las rutas y lógica de backend

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
