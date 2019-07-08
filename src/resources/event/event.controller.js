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
  console.log('from', parsedDateFrom);
  console.log('to', parsedDateTo);
  MongoClient.connect(process.env.DATABASE_URL, async (err, db) => {
    if (err) {
      console.error(err);
      return res.status(500).end();
    } else {
      const dbo = db.db('negotiumDB');
      const eventsArray = [];
      await dbo.collection('events').find(
        {
          'start.dateTime': {
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
  console.log(req.body.result.items[0]);
  const { items } = req.body.result;
  items.map(item => {
    const event = new Event({
      created: item.created ? item.created : null,
      creator: {
        email: item.creator.email,
        self: item.creator.self,
      },
      description: item.description,
      end: {
        dateTime: new Date(item.end.dateTime).getTime(),
      },
      extendedProperties: {
        private: {
          everyoneDeclinedDismissed: item.extendedProperties.private.everyoneDeclinedDismissed,
        },
      },
      htmlLink: item.htmlLink ? item.htmlLink : null,
      iCalUID: item.iCalUID ? item.iCalUID : null,
      id: item.id,
      kind: item.kind ? item.kind : null,
      location: item.location,
      organizer: {
        email: item.organizer.email,
        self: item.organizer.self,
      },
      reminders: {
        useDefault: item.reminders.useDefault,
      },
      start: {
        dateTime: new Date(item.start.dateTime).getTime,
      },
      status: item.status ? item.summary : null,
      summary: item.summary ? item.summary : null,
      updated: item.updated ? item.updated : null,
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
