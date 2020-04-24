const shortId = require('shortid');
const _ = require('lodash');
const redisClient = require('../redisClient');

function Messages() {
    this.client = redisClient.getClient()
}

module.exports = new Messages();

Messages.prototype.upsert = function ({ roomId, message, userName, userSurName }) {
    const id = shortId.generate();
    this.client.hset('messages:' + roomId, id, JSON.stringify({
        id,
        message,
        userName,
        userSurName,
        created_at: Date.now()
    }), err => {
        if (err)
            console.error(err);
    });
};

Messages.prototype.list = function (roomId, callback) {
    let messageList = [];

    this.client.hgetall('messages:' + roomId, (err, data) => {
        if (err) {
            console.error(err);
            return callback([]);
        }
        for (let msg in data) {
            if (data.hasOwnProperty(msg))
                messageList.push(JSON.parse(data[msg]));
        }
        return callback(_.orderBy(messageList, 'created_at', 'asc'));
    });
}