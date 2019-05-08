const express = require('express');
const router = express.Router();
const logger = require('../services/logger');
const Event = require('../models/event');
const Token = require('../models/token');


//-------------------------------------------API GETTERS-------------------------------------//

router.get('/events', (req, res, next) => {
    Event.find({})
        .exec()
        .then(events => {
            res.status(200).json({
                events
            });
        })
        .catch(error => {
            logger.loggerError.error(error);
            res.status(500).json({
                error: error
            });
        });
});

router.get('/token', (req, res, next) => {
    Token.find({})
        .exec()
        .then(token => {
            res.status(200).json({
                token
            });
        })
        .catch(error => {
            logger.loggerError.error(error);
            res.status(500).json({
                error: error
            });
        });
});

//-------------------------------------------API POSTS-------------------------------------//

router.post('/events', (req, res, next) => {

    const event = new Event({
        eventTitle: req.body.eventTitle,
        date: new Date()
    });
    event.save().then(e => {
        if (e) {
            logger.loggerInfo.info(`new event: ${e}`);
            res.status(201).json({
                message: 'success'
            });
        }
        else {
            logger.loggerError.error(`Something went wrong`);
            return null;
        }
    }).catch(error => {
        logger.loggerError.error(error);
        res.status(500).json({
            error: error
        });
    });
});

router.post('/token', (req, res, next) => {

    const token = new Token({
        tokenID: req.body.tokenID,
    });
    token.save().then(t => {
        if (t) {
            logger.loggerInfo.info(`new token: ${t}`);
            res.status(201).json({
                message: 'success'
            });
        }
        else {
            logger.loggerError.error(`Something went wrong`);
            return null;
        }
    }).catch(error => {
        logger.loggerError.error(error);
        res.status(500).json({
            error: error
        });
    });
});



module.exports = router;
