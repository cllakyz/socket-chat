const shortId = require('shortid');
const redisClient = require('../redisClient');

function Rooms() {
    this.client = redisClient.getClient()
}

module.exports = new Rooms();

Rooms.prototype.upsert = function (name) {
    const newId = shortId.generate();
    const id = '@Room:' + newId;
    this.client.hset('rooms', id, JSON.stringify({
        id,
        name,
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