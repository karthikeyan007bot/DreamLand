const mongoose  =  require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken')
const profileSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    userId : {
         type : String,
         unique : true
    },
    email : {
        type : String,
        unique : true,
   },
    about : String,
    settings : {
    hide_sensitivity : Boolean,
    blocked_users : Array ,
    profile_visibility : Boolean,
    direct_message : String,
    whocanseebd : String,
    },
    prflimg : String,
    joinedat : String,
    followers : Array,
    following : Array,
    fbuserid : String,
    instauserid : String,
    twtruserid : String,
    fantoms : Array,
    fantomMini : Array,
    annexes : Array, 
    alters :  Array,
    replies : Array,
    likes : Array,
    hash:String,
    salt:String
});

profileSchema.methods.setPassword= function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password,this.salt,1000,64,'sha512').toString('hex');
};
profileSchema.methods.validPassword= function(password){
    const hash = crypto.pbkdf2Sync(password,this.salt,1000,64,'sha512').toString('hex');
    return this.hash === hash
};
profileSchema.methods.generateJwt = function(){
 const expiry = new Date();
 expiry.setDate(expiry.getDate() + 7);
 return jwt.sign(
     {
    _id :this._id,
    email: this.email,
    name: this.name,
    userId : this.userId,
    prflImg : this.prflimg,
    exp : parseInt(expiry.getTime() / 1000)
 }, process.env.JWT_SECRET);
};

mongoose.model('Profile',profileSchema)