const redis = require('redis');

function Users() {
    this.client = redis.createClient({
        host: process.env.REDIS_URL,
        port: process.env.REDIS_PORT,
    });
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