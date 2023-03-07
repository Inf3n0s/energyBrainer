const IP = '87.229.115.161'

// get temperature from server
export function getStats() {
    return fetch('http://' + IP + '/')
        .then(response => response.json())
        .then(data => {
            return data;
        });
}

// get temperature chart from server
export function getTemperatureChart(room) {
    if (!room) {
        return fetch('http://' + IP + '/last')
            .then(response => response.json())
            .then(data => {
                return data;
            });
    } else {
        return fetch('http://' + IP + '/room/' + room)
            .then(response => response.json())
            .then(data => {
                return data;
            });
    }
}

// post current monitored room
export function setRoom(room) {
    fetch('http://' + IP + '/room', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ room: room })
    })
}