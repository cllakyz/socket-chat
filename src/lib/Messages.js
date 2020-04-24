const shortId = require('shortid');
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