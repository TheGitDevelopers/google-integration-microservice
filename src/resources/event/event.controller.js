/* eslint-disable */
import Event from './event.model';
import logger from '../../tools/logger';
const MongoClient = require('mongodb').MongoClient;

const getAll = (req, res) => {
  Event.find({})
    .exec()
    .then(events => {
      res.status(200).json({
        events,
      });
    })
    .catch(error => {
      logger.loggerError.error(error);
      res.status(500).json({
        error,
      });
    });
};

const findByDateRange = (req, res) => {
  const { dateFrom, dateTo } = req.body.event;
  const parsedDateFrom = new Date(dateFrom.toString()).getTime();
  const parsedDateTo = new Date(dateTo.toString()).getTime();
  console.log(parsedDateFrom);
  MongoClient.connect(process.env.DATABASE_URL, async (err, db) => {
    if (err) {
      console.error(err);
      return res.status(500).end();
    } else {
      const dbo = db.db('negotiumDB');
      const eventsArray = [];
      await dbo.collection('events').find(
        {
          updated: {
            $gte: parsedDateFrom,
            $lte: parsedDateTo,
          },
        },
        async (error, items) => {
          if (error) {
            console.error(err);
            return res.status(500).end();
          } else {
            await items.forEach((event, err) => {
              if (err) {
                console.error(err);
                res.status(500).end();
              } else eventsArray.push(event);
            });
          }
        },
      );
      return res.status(200).json({
        data: eventsArray,
      });
    }
  });
};

const createOne = (req, res) => {
  const { items } = req.body.result;
  items.map(item => {
    const event = new Event({
      created: item.created,
      creator: {
        email: item.creator.email,
        self: item.creator.self,
      },
      description: item.description,
      end: {
        dateTime: item.end.dateTime,
      },
      extendedProperties: {
        private: {
          everyoneDeclinedDismissed: item.extendedProperties.private.everyoneDeclinedDismissed,
        },
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
        dateTime: item.start.dateTime,
      },
      status: item.status,
      summary: item.summary,
      updated: item.updated,
      timeZone: req.body.result.timeZone,
    });
    event
      .save()
      .then(e => {
        if (e) {
          res.status(201).json({
            message: 'Event has been added',
          });
        } else {
          logger.loggerError.error('Something went wrong');
          return null;
        }
      })
      .catch(error => {
        logger.loggerError.error(error);
        res.status(500).json({
          error,
        });
      });
  });
};

const removeOne = (req, res) => {
  const { id } = req.params;
  Event.deleteOne({
    _id: id,
  })
    .exec()
    .then(e => {
      res.status(200).json(e);
    })
    .catch(error => {
      res.status(500).json({
        error,
      });
    });
};

const findAndUpdateOne = (req, res) => {
  Event.findById(req.body.id, (err, event) => {
    if (err) {
      res.status(500).json({
        error: err,
      });
    } else {
      const { item } = req.body;
      event.created = item.created;
      event.creator = {
        email: item.creator.email,
        self: item.creator.self,
      };
      event.description = item.description;
      event.end = {
        dateTime: item.end.dateTime,
      };
      event.extendedProperties = {
        private: {
          everyoneDeclinedDismissed: item.extendedProperties.private.everyoneDeclinedDismissed,
        },
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
        dateTime: item.start.dateTime,
      };
      event.status = item.status;
      event.summary = item.summary;
      event.updated = item.updated;
      event.timeZone = req.body.result.timeZone;
      res.status(200).json({
        message: `Event [id:${event._id}] has been updated`,
      });
    }
  });
};

export default {
  getAll,
  createOne,
  removeOne,
  findAndUpdateOne,
  findByDateRange,
};
