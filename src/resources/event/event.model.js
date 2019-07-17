import mongoose from 'mongoose';

const eventSchema = mongoose.Schema({
  created: String,
  creator: {
    email: String,
    self: Boolean,
  },
  description: String,
  end: {
    date: {
      type: Number,
    },
  },
  extendedProperties: {
    private: {
      everyoneDeclinedDismissed: String,
    },
  },
  htmlLink: {
    type: String,
    default: null,
  },
  iCalUID: {
    type: String,
    default: null,
  },
  id: String,
  kind: {
    type: String,
    default: null,
  },
  location: String,
  organizer: {
    email: String,
    self: Boolean,
  },
  reminders: {
    useDefault: Boolean,
  },
  start: {
    date: {
      type: Number,
    },
  },
  status: {
    type: String,
    default: null,
  },
  summary: {
    type: String,
    default: null,
  },
  updated: {
    type: String,
    default: null,
  },
  timeZone: {
    type: String,
    default: null,
  },
});

export default mongoose.model('Event', eventSchema);
