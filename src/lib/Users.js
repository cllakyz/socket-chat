const redisClient = require('../redisClient');

function Users() {
    this.client = redisClient.getClient()
}

module.exports = new Users();

Users.prototype.upsert = function (connectionId, meta) {
    this.client.hset('onlineUsers', meta._id, JSON.stringify({
        connectionId,
        meta,
        created_at: Date.now()
    }), err => {
        if (err)
            console.error(err);
    });
};

Users.prototype.remove = function (_id) {
    this.client.hdel('onlineUsers', _id, err => {
        if (err)
            console.error(err);
    });
}

Users.prototype.list = function (callback) {
    let active = [];

    this.client.hgetall('onlineUsers', (err, data) => {
        if (err) {
            console.error(err);
            return callback([]);
        }
        for (let user in data) {
            if (data.hasOwnProperty(user))
                active.push(JSON.parse(data[user]));
        }
        return callback(active);
    });
}