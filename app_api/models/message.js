const mongoose  =  require('mongoose');
const messageSchema = new mongoose.Schema({
    message : String,
    timeStamp :  {type : Date, default : Date.now()},
    from : String, 
    to : String,
    status : { type : String , default : 'sent'}
})
 mongoose.model('Message', messageSchema)