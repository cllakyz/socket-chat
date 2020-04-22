const socketio = require('socket.io');
const redisAdapter = require('socket.io-redis');
const socketAuthorization = require('../middlewares/socketAuthorization');

const io = socketio();

const socketApi = {
    io,
};

// Socket authorization
io.use(socketAuthorization);

// Redis adapter
io.adapter(redisAdapter({
    host: process.env.REDIS_URL,
    port: process.env.REDIS_PORT
}));

io.on('connection', socket => {
    console.log('a user logged in with name ' + socket.request.user.name);
});

module.exports = socketApi;