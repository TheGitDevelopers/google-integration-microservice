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

const findAndUpdateEvent = (req, res) => {
  const { event } = req.body;
  console.log(event.id);
  Event.findOneAndUpdate(
    { id: event.id },
    {
      creator: {
        email: event.creator.email,
        self: event.creator.self,
      },
      end: {
        dateTime: event.end.dateTime,
      },
      extendedProperties: {
        private: {
          everyoneDeclinedDismissed: event.extendedProperties.private.everyoneDeclinedDismissed,
        },
      },
      organizer: {
        email: event.organizer.email,
        self: event.organizer.self,
      },
      reminders: {
        useDefault: event.reminders.useDefault,
      },
      start: {
        dateTime: event.start.dateTime,
      },
      htmlLink: event.htmlLink,
      iCalUID: event.iCalUID,
      kind: event.kind,
      status: event.status,
      summary: event.summary,
      updated: event.updated,
      timeZone: event.timeZone,
      created: event.created,
      description: event.description,
      id: event.id,
    },
    (err, event) => {
      if (err) {
        res.status(500).json({
          error: err,
        });
      } else {
        res.status(200).json({
          message: `Event [id:${event.id}] has been updated`,
        });
      }
    },
  );
};

export default {
  getAll,
  createOne,
  removeOne,
  findAndUpdateEvent,
  findByDateRange,
};
