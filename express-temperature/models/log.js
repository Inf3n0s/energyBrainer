const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logSchema = new Schema({
    temp: Number,
    humidity: Number,
    // use date as index
    date: {
        type: Date,
        index: true
    },
    // use room as index
    room: {
        type: String,
        index: true,
        default: ''
    }
});

module.exports = mongoose.model('Log', logSchema);