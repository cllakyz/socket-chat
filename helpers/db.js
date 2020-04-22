const mongoose = require('mongoose');

const url = process.env.DB_STRING;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
};

module.exports = () => {
    mongoose.connect(url, options);
    mongoose.connection.on('open', () => {
        // console.log('MongoDB: Connected');
    });
    mongoose.connection.on('error', (err) => {
        console.log('MongoDB: Error', err);
    });

    mongoose.Promise = global.Promise;
};