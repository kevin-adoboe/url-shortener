const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const urlsRouter = require('./routes/urls');

const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/', urlsRouter);

module.exports = app;
