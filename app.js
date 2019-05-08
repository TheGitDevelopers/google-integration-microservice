const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

const indexRouter = require('./routes/index');

mongoose.connect('mongodb+srv://negotiumAdmin:y4uL28-naiU4Sad@google-negotium-integration-awpdk.mongodb.net/test?retryWrites=true',
    {
        useNewUrlParser: true
    });


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/api', indexRouter);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));


module.exports = app;
