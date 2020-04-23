const socketio = require('socket.io');
const redisAdapter = require('socket.io-redis');
const socketAuthorization = require('../middlewares/socketAuthorization');

const io = socketio();

const socketApi = {
    io,
};

// libs
const Users = require('./lib/Users');

// Socket authorization
io.use(socketAuthorization);

// Redis adapter
io.adapter(redisAdapter({
    host: process.env.REDIS_URL,
    port: process.env.REDIS_PORT
}));

io.on('connection', socket => {
    console.log('a user logged in with name ' + socket.request.user.name);

    Users.upsert(socket.id, socket.request.user);

    Users.list(users => {
       io.emit('onlineList', users);
    });

    socket.on('disconnect', () => {
        Users.remove(socket.request.user._id);

        Users.list(users => {
            io.emit('onlineList', users);
        });
    });
});

module.exports = socketApi;