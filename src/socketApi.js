const socketio = require('socket.io');
const redisAdapter = require('socket.io-redis');
const socketAuthorization = require('../middlewares/socketAuthorization');

const io = socketio();

const socketApi = {
    io,
};

// libs
const Users     = require('./lib/Users');
const Rooms     = require('./lib/Rooms');
const Messages  = require('./lib/Messages');

// Socket authorization
io.use(socketAuthorization);

// Redis adapter
io.adapter(redisAdapter({
    host: process.env.REDIS_URL,
    port: process.env.REDIS_PORT
}));

io.on('connection', socket => {
    console.log('a user logged in with name ' + socket.request.user.name);

    Rooms.list(rooms => {
        io.emit('roomList', rooms);
    });

    Users.upsert(socket.id, socket.request.user);

    Users.list(users => {
       io.emit('onlineList', users);
    });

    socket.on('newRoom', name => {
        Rooms.upsert(name);
        Rooms.list(rooms => {
            io.emit('roomList', rooms);
        });
    });

    socket.on('newMessage', data => {
        Messages.upsert({
            ...data,
            userId: socket.request.user._id,
            userName: socket.request.user.name,
            userSurName: socket.request.user.surname,
        });
    });

    socket.on('disconnect', () => {
        Users.remove(socket.request.user._id);

        Users.list(users => {
            io.emit('onlineList', users);
        });
    });
});

module.exports = socketApi;