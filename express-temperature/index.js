const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();

const mongoose = require('mongoose');
const log = require('./models/log');
mongoose.connect('mongodb://127.0.0.1:27017/energybrain', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log('Error connecting to MongoDB', err);
});

app.use(bodyParser.json({ type: 'application/json' }));
app.use(morgan('dev'));

app.post('/', (req, res) => {
    let temp = req.body.temp;
    let humidity = req.body.humidity;

    if (!temp || !humidity) {
        res.status(400).send('Bad request');
        return;
    }

    let logEntry = new log({
        temp: temp,
        humidity: humidity,
        date: new Date()
    });

    logEntry.save().catch((err) => {
        console.log('Error saving to database', err);
    });

    res.status(200).send();
});


app.get('/', async (req, res) => {
    if (!req.query.date) {
        res.status(200).send(await log.find({}));
    } else {
        reqDate = Date.parse(req.query.date);
        try {
            // new Date().toUTCString()
            // find logs after the date
            let logs = await log.find({ date: { $gte: reqDate } }).select('temp humidity date -_id');
            res.status(200).send(logs);
        } catch (err) {
            console.log(err);
        }
    }
});

app.listen(3000, () => console.log('Listening on port 3000'));