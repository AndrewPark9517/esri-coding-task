'use strict';
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');

const app = express();

// Logging
app.use(morgan('common'));



app.listen(8080);