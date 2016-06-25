const express = require('express');
const path    = require('path');

// initialize the express app
var app       = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

module.exports = app;
