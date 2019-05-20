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

router.post('/events', async (req, res, next) => {
    const items = req.body.result.items;
    items.map(item => {
        console.log(item);
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
                    everyoneDeclinedDismissed: item.extendedProperties.private.everyoneDeclinedDismissed
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
                useDefault: item.reminders.useDefault,
            },
            sequence: item.sequence,
            start: {
                dateTime: item.start.dateTime
            },
            status: item.status,
            summary: item.summary,
            updated: item.updated,
            timeZone: req.body.result.timeZone,
        });
        event.save().then(e => {
            if (e) {
                res.status(201).json({
                    message: "Event has been added"
                });
            } else {
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
        } else {
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

router.delete('/events', (req, res) => {
    const id = req.body.id;
    console.log(id);
    Event.deleteOne({_id: id})
        .exec()
        .then(e => {
            res.status(200).json(e);
        })
        .catch(error => {
            res.status(500).json({
                error: error
            });
        });
});


router.put('/events', (req, res, next) => {
    Event.findById(req.body.id, (err, event) => {
        if (err) {
            res.status(500).json({
                error: err
            });
        }
        else {
            const item = req.body.item;
            event.created = item.created;
            event.creator = {
                email: item.creator.email,
                self: item.creator.self,
            };
            event.description = item.description;
            event.end = {
                dateTime: item.end.dateTime
            };
            event.extendedProperties = {
                private: {
                    everyoneDeclinedDismissed: item.extendedProperties.private.everyoneDeclinedDismissed
                }
            };
            event.htmlLink = item.htmlLink;
            event.iCalUID = item.iCalUID;
            event.id = item.id;
            event.kind = item.kind;
            event.location = item.location;
            event.organizer = {
                email: item.organizer.email,
                self: item.organizer.self,
            };
            event.reminders = {
                useDefault: item.reminders.useDefault,
            };
            event.sequence = item.sequence;
            event.start = {
                dateTime: item.start.dateTime
            };
            event.status = item.status;
            event.summary = item.summary;
            event.updated = item.updated;
            event.timeZone = req.body.result.timeZone;
            res.status(200).json({
                message: `Event [id:${event._id}] has been updated`
            });
        }
    })
});


module.exports = router;