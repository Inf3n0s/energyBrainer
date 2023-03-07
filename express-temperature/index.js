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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

let currentRoom = '';
let currentRoomTime = new Date();
let currentTemp = 0;
let currentHumidity = 0;

app.post('/', (req, res) => {
    let temp = req.body.temp;
    let humidity = req.body.humidity;

    currentTemp = temp;
    currentHumidity = humidity;

    if (!temp || !humidity) {
        res.status(400).send('Bad request');
        return;
    }

    let logEntry = new log({
        temp: temp,
        humidity: humidity,
        date: new Date(),
        room: currentRoom
    });

    logEntry.save().catch((err) => {
        console.log('Error saving to database', err);
    });

    res.status(200).send();
});

// get current temperature and humidity
app.get('/', (req, res) => {
    res.status(200).send({
        temp: currentTemp,
        humidity: currentHumidity,
        room: currentRoom,
        roomTime: currentRoomTime
    });
});


// get temperature and humidity for past 24 hours with 3 hour intervals and the average for 24 hours
app.get('/last', async (req, res) => {
    // date 24 hours ago
    let reqDate = new Date();
    reqDate.setDate(reqDate.getDate() - 1);

    try {
        // find logs after the date
        let logs = await log.find({ date: { $gte: reqDate } }).select('temp humidity date -_id');
        
        // calculate the average for each 3 hour interval
        logs = calculateAverage(logs);

        // calculate the average for the last 24 hours
        let temp = 0;
        logs.forEach((item) => {
            temp += item.temp;
        });
        temp /= logs.length;
        
        let response = {
            temp: temp.toFixed(1),
            data: logs
        };

        res.status(200).send(response);
    } catch (err) {
        console.log(err);
    }
});

// get temperature and humidity for every hour for a certain room for every day for the past 14 days
app.get('/room/:room', async (req, res) => {
    let reqRoom = req.params.room;

    // date 14 days ago
    let reqDate = new Date();
    reqDate.setDate(reqDate.getDate() - 14);

    try {
        // find logs after the date
        let logs = await log.find({ date: { $gte: reqDate }, room: reqRoom }).select('temp humidity date');

        // calculate the average for each hour
        logs = calculateAverage2(logs);

        // get average temperature in the room
        let temp = 0;
        logs.forEach((item) => {
            temp += item.temp;
        });
        temp /= logs.length;

        let response = {
            temp: temp.toFixed(1),
            data: logs
        };

        res.status(200).send(response);
    } catch (err) {
        console.log(err);
    }
});

// set current monitored room
app.post('/room', (req, res) => {
    let room = req.body.room;

    if (!room) {
        res.status(400).send('Bad request');
        return;
    }

    currentRoom = room;
    currentRoomTime = new Date();

    res.status(200).send();
});


app.listen(3000, () => console.log('Listening at http://127.0.0.1:3000'));

function calculateAverage(data) {
    // Check that the data is an array
    if (!Array.isArray(data)) {
        throw new Error('Invalid data');
    }

    const result = [];

    // break the data into 3 hour intervals, using the date as the index
    let reduced = data.reduce((r, a) => {
        r[a.date.getHours()] = [...r[a.date.getHours()] || [], a];
        return r;
    }, {})

    Object.values(reduced).forEach((value, index) => {
        // calculate the average for each 3 hour interval
        let temp = 0;
        let humidity = 0;
        value.forEach((item) => {
            temp += item.temp;
            humidity += item.humidity;
        });
        temp /= value.length;
        humidity /= value.length;

        result.push({
            temp: temp,
            humidity: humidity,
            // set the date to the date of the first item in the interval and the time to the beginning of the interval
            date: new Date(value[0].date.getFullYear(), value[0].date.getMonth(), value[0].date.getDate(), index * 3, 0, 0)
        });
    });

    // sort the result by date
    result.sort((a, b) => {
        return a.date - b.date;
    });

    return result;
}

// calculate the average but include every hour, even if there is no data for that hour and set the temperature and humidity to 0
function calculateAverage2(data) {
    // Check that the data is an array
    if (!Array.isArray(data)) {
        throw new Error('Invalid data');
    }

    const result = [];

    // break the data into 3 hour intervals, using the date as the index
    let reduced = data.reduce((r, a) => {
        r[a.date.getHours()] = [...r[a.date.getHours()] || [], a];
        return r;
    }, {})

    Object.values(reduced).forEach((value, index) => {
        // calculate the average for each 3 hour interval
        let temp = 0;
        let humidity = 0;
        value.forEach((item) => {
            temp += item.temp;
            humidity += item.humidity;
        });
        temp /= value.length;
        humidity /= value.length;

        result.push({
            temp: temp,
            humidity: humidity,
            // set the date to the date of the first item in the interval and the time to the beginning of the interval
            date: new Date(value[0].date.getFullYear(), value[0].date.getMonth(), value[0].date.getDate(), index * 3, 0, 0)
        });
    });

    // sort the result by date
    result.sort((a, b) => {
        return a.date - b.date;
    });

    // add the missing hours
    let i = 0;
    let j = 0;
    while (i < 24) {
        if (result[j] && result[j].date.getHours() == i) {
            i += 3;
            j++;
        } else {
            result.splice(j, 0, {
                temp: 0,
                humidity: 0,
                date: new Date(result[j - 1].date.getFullYear(), result[j - 1].date.getMonth(), result[j - 1].date.getDate(), i, 0, 0)
            });
            i += 3;
        }
    }

    return result;
}