const express = require('express');
const app = express();

const dadosRoute = require('./routes/dados');

app.use('/dados', dadosRoute);

module.exports = app;
