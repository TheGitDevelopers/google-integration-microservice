import mongoose from 'mongoose';

const eventSchema = mongoose.Schema({
  created: String,
  creator: {
    email: String,
    self: Boolean,
  },
  description: String,
  end: {
    dateTime: String,
  },
  extendedProperties: {
    private: {
      everyoneDeclinedDismissed: String,
    },
  },
  htmlLink: String,
  iCalUID: String,
  id: String,
  kind: String,
  location: String,
  organizer: {
    email: String,
    self: Boolean,
  },
  reminders: {
    useDefault: Boolean,
  },
  sequence: Number,
  start: {
    dateTime: String,
  },
  status: String,
  summary: String,
  updated: String,
  timeZone: String,
});

export default mongoose.model('Event', eventSchema);
