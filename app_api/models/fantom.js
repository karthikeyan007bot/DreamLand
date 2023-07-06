const mongoose = require('mongoose')
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
   const chapterSchema = new mongoose.Schema({
    title : String,
    chapter : String
   })
   replySchema.add({ replies: [replySchema] });
const fantomSchema = new mongoose.Schema({
       title : String,
       desc : String,
       tags : Array, 
       catagory : String,
       prota : Array,
       anta : Array,
       deuta : Array,
       tert : Array,
       feelings : Array,
       age_rating : Boolean,
       who_can_see : String,
       post_as : String,
       backGround : Array,
       usrRefId : String,
       cover : String,
       replies : [replySchema],
       likes : Array,
       chapters : [chapterSchema]
})
mongoose.model('Fantom', fantomSchema)