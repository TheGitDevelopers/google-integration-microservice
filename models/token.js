const mongoose = require('mongoose');

const tokenSchema = mongoose.Schema({
    tokenID: String
});

module.exports = mongoose.model('Token', tokenSchema);