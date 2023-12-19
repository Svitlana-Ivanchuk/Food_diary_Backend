/** @format */

const express = require('express');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();

const authRouter = require('./routers/api/auth');
const usersRouter = require('./routers/api/users');
const foodRouter = require('./routers/api/recommendedFood');
const swaggerRouter = require('./routers/api/swagger');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

app.use(logger(formatsLogger));
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/user', usersRouter);
app.use('/api/recommended-food', foodRouter);
app.use('/api-docs', swaggerRouter);
app.use(express.static('public'));

app.use((_, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});

module.exports = app;
