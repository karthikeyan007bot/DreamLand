const mongoose = require('mongoose');
let dbURI = "mongodb+srv://karthikeyan:incorrect2003ds@cluster0.hwzvw.mongodb.net/FantomVerse?retryWrites=true&w=majority"
mongoose.connect(dbURI, {useNewUrlParser: true});

mongoose.connection.on('connected',()=>{
    console.log(`Mongoose connected to ${dbURI}`);
});

mongoose.connection.on('error',err=>{
    console.log(`error: ${err}`)
})
mongoose.connection.on('disconnected',()=>{
    console.log('disconnected')
})

// 
const gracefullShutdown = (msg,callback)=>{
    mongoose.connection.close(()=>{
        console.log(`mongoose disconnected through ${msg}`);
        callback();
    })
}
process.once('SIGUSR2',()=>{
    gracefullShutdown('nodemon restart',()=>{
        process.kill(process.pid,'SIGUSR2')
    })
});

process.on('SIGINT',()=>{
    gracefullShutdown('app termination',()=>{
        process.exit(0)
    })
});

process.on('SIGTERM',()=>{
    gracefullShutdown('Heroku app shutdown',()=>{
        process.exit(0)
    })
})
require('./fantommini')
require('./profile')
require('./message')
require('./fantom')
require('./reports')

