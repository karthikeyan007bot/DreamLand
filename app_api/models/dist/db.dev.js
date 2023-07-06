"use strict";

var mongoose = require('mongoose');

var dbURI = "mongodb+srv://karthikeyan:incorrect2003ds@cluster0.hwzvw.mongodb.net/FantomVerse?retryWrites=true&w=majority";
mongoose.connect(dbURI, {
  useNewUrlParser: true
});
mongoose.connection.on('connected', function () {
  console.log("Mongoose connected to ".concat(dbURI));
});
mongoose.connection.on('error', function (err) {
  console.log("error: ".concat(err));
});
mongoose.connection.on('disconnected', function () {
  console.log('disconnected');
}); // 

var gracefullShutdown = function gracefullShutdown(msg, callback) {
  mongoose.connection.close(function () {
    console.log("mongoose disconnected through ".concat(msg));
    callback();
  });
};

process.once('SIGUSR2', function () {
  gracefullShutdown('nodemon restart', function () {
    process.kill(process.pid, 'SIGUSR2');
  });
});
process.on('SIGINT', function () {
  gracefullShutdown('app termination', function () {
    process.exit(0);
  });
});
process.on('SIGTERM', function () {
  gracefullShutdown('Heroku app shutdown', function () {
    process.exit(0);
  });
});

require('./fantommini');

require('./profile');

require('./message');

require('./fantom');

require('./reports');