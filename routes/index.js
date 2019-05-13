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

    const items = req.body.result.items;
    const events = [];
    items.map(item => {
        const event = new Event({
            created: item.created,
            creator: {
                email: item.creator.email,
                self: item.creator.self,
            },
            description: item.description,
            end: {
                dateTime: item.end.dateTime
            },
            extendedProperties: {
                private: {
                    everyoneDeclinedDismissed: item.private.everyoneDeclinedDismissed
                }
            },
            htmlLink: item.htmlLink,
            iCalUID: item.iCalUID,
            id: item.id,
            kind: item.kind,
            location: item.location,
            organizer: {
                email: item.organizer.email,
                self: item.organizer.self,
            },
            reminders: {
                useDefault:  item.reminders.useDefault,
            },
            sequence: item.sequence,
            start: {
                dateTime: item.start.dateTime
            },
            status:  item.status,
            summary:  item.summary,
            updated:  item.updated,
            timeZone:  req.body.result.timeZone,
        });
         event.save().then(e => {
             if (e) {
                 logger.loggerInfo.info(`new event: ${e}`);
                 events.push(item);
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
    console.log(items.length);
    res.status(201).json({
        events: events
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
