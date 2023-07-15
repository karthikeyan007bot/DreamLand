const mongoose  =  require('mongoose');
const replySchema = new mongoose.Schema({
    body : String,
    media : String,
    usrRefId : String,
    fminiRefId : String,
    timeStamp: {
        type: Date,
        default: Date.now()
    },
    likes : Array
})
replySchema.add({ replies: [replySchema] });

const annexSchema = new mongoose.Schema({
    body : String,
    media : String,
    usrRefId : String,
    fminiRefId : String,
    likes : Array,
    timeStamp: {
        type: Date,
        default: Date.now()
    }
})
annexSchema.add({ replies: [replySchema] });
const alterSchema = new mongoose.Schema({
    body : String,
    media : String,
    usrRefId : String,
    fminiRefId : String,
    likes : Array,
    timeStamp: {
        type: Date,
        default: Date.now()
    }
})
alterSchema.add({ replies: [replySchema] });
const miniSchema = new mongoose.Schema({
    userName : String,
    userId : String,
    refId : String,
    body : String,
    settings : Object,
    media : String,
    tags : Array,
    mood : String,
    catagory : String,
    likes : Array,
    bookmarks : Array,
    replies : [replySchema],
    alters : [alterSchema],
    annexes : [annexSchema],
    timeStamp : {
        type :  Date,
        default : Date.now()
    }
})
mongoose.model('Fmini', miniSchema)