const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    eventTitle: String,
    date: mongoose.Schema.Types.Mixed,
});

module.exports = mongoose.model('Event', eventSchema);