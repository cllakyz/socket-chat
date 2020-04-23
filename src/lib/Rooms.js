const redisClient = require('../redisClient');

function Rooms() {
    this.client = redisClient.getClient()
}

module.exports = new Rooms();

Rooms.prototype.upsert = function (roomName) {
    this.client.hset('rooms', roomName, JSON.stringify({
        name: roomName,
        created_at: Date.now()
    }), err => {
        if (err)
            console.error(err);
    });
};

Rooms.prototype.list = function (callback) {
    let roomList = [];

    this.client.hgetall('rooms', (err, data) => {
        if (err) {
            console.error(err);
            return callback([]);
        }
        for (let room in data) {
            if (data.hasOwnProperty(room))
                roomList.push(JSON.parse(data[room]));
        }
        return callback(roomList);
    });
}