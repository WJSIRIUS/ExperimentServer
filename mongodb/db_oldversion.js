const mongoose = require('mongoose')
const config = require('../config.json')

const url = config.url
// const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
const connectionOptions = { useNewUrlParser: true, useUnifiedTopology: true, };

mongoose.connect(process.env.MONGODB_URI || config.connectionString, connectionOptions);
mongoose.Promise = global.Promise;;

const db = mongoose.connection

db.once('open', () => {
    console.log(
        ('Connection Successful.')
    );
})

db.on('error', function (error) {
    console.error(
        ('Error in MongoDb connection: ' + error)
    );
    mongoose.disconnect();
});

db.on('close', function () {
    console.log(
        ('Disconnect from MongoDb, try again later.')
    );
    mongoose.connect(url, { server: { auto_reconnect: true } });
});



module.exports = {
    Experiment: require('./models/experiment'),
    Rank: require('./models/stage2rank'),
}

