const mongoose = require('mongoose');
// const dbURI = 'mongodb://localhost/Loc8r'; 
// var dbURI = 'mongodb+srv://k1014ttl:1014ttl@cluster0.qke4ujn.mongodb.net/Loc8r';
const dbPort = 27017;
const dbURI = `mongodb://127.0.0.1:${dbPort}/Loc8r`;
mongoose.connect(dbURI, {useNewUrlParser: true}); 
mongoose.connection.on('connected', () => {
  console.log(`Mongoose connected to ${dbURI}`);
});
mongoose.connection.on('error', err => { 
    console.log(`Mongoose connection error: ${err}`);
});
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
  });
const gracefulShutdown = (msg, callback) => { 
    mongoose.connection.close( () => {
        console.log(`Mongoose disconnected through ${msg}`);
        callback();
    });
};
// For nodemon restarts
process.once('SIGUSR2', () => {
    gracefulShutdown('nodemon restart', () => { 
        process.kill(process.pid, 'SIGUSR2');
    }); 
});
// For app termination 
process.on('SIGINT', () => {
    gracefulShutdown('app termination', () => {
        process.exit(0);
    });
});
// For Heroku app termination 
process.on('SIGTERM', () => {
    gracefulShutdown('Heroku app shutdown', () => {
        process.exit(0);
    }); 
});
require('./locations')