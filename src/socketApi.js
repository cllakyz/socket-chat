const socketio = require('socket.io');
const redisAdapter = require('socket.io-redis');

const io = socketio();

const socketApi = {
    io,
};

io.adapter(redisAdapter({
    host: process.env.REDIS_URL,
    port: process.env.REDIS_PORT
}));

io.on('connection', socket => {
    console.log('a user logged in');
});

module.exports = socketApi;