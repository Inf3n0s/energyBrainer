const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logSchema = new Schema({
    temp: Number,
    humidity: Number,
    // use date as index
    date: {
        type: Date,
        index: true
    }
});

module.exports = mongoose.model('Log', logSchema);