/* eslint-disable no-unused-expressions */

import express from 'express';
import cookieParser from 'cookie-parser';
import httpLogger from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import logger from './tools/logger';
import eventRouter from './resources/event/event.route';
import tokenRouter from './resources/token/token.route';

dotenv.config();

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
});
const app = express();

app.use(httpLogger('dev'));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  }),
);
app.use(cookieParser());
app.use(bodyParser.json());

// -------------------------cors configuration----------------------------//
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

// -------------------------global logger----------------------------//
app.all('*', (req, res, next) => {
  logger.loggerInfo.info(req.params);
  logger.loggerInfo.info(
    `[${new Date().toDateString()} | Time ${new Date().toLocaleTimeString()}] - Incoming request - [method: ${
      req.method
    }]`,
  );
  return next();
});

// -------------------------routes--------------------------------//
app.use('/api/events', eventRouter);
app.use('/api/token', tokenRouter);

// ------------------------Database error handling------------------------------//
const db = mongoose.connection;
db.on('error', logger.loggerError.error.bind(console, 'MongoDB connection error:'));

// ------------------------server configuration------------------------------//
app.listen(process.env.PORT || 9000, () => {
  const port = process.env.PORT || 9000;
  try {
    port
      ? logger.loggerInfo.info(`The server is running on port ${port}`)
      : logger.loggerInfo.info(`The server is running on default port ${port}`);
  } catch (e) {
    logger.loggerError.error(e);
  }
});

module.exports = app;
