const mongoose = require('mongoose')
const Fmini = mongoose.model('Fmini')
const Message = mongoose.model('Message')
const Profile = mongoose.model('Profile')
const Fantom = mongoose.model('Fantom')

class search_result{
  constructor(id,body, media,user_id, name, userId, prflimg){
    this._id = id;
    this.body = body;
    this.media = media;
    this.user_id = user_id;
    this.name = name;
    this.userId = userId;
    this.prflimg = prflimg
  }
}
const findByFantom  = async (req, res) => {
  Fantom.find({ $or: [ { title: { $regex: new RegExp(req.params.value, 'i') } }, { desc: { $regex: new RegExp(req.params.value, 'i') } } ] }).select({title : 1, desc : 1, cover : 1, usrRefId : 1}).exec(async (err, fantoms) => {
        const usrIds = fantoms.map(fantom => ({
            userId: fantom.usrRefId,
            itemId: fantom._id,
            fantom: fantom // Store the entire fantom object
          }));
        const users = await Promise.all(usrIds.map(async (id) => {
            const user = await Profile.findById(id.userId); // Find user by id
            return { user_id: user._id, userId: user.userId, name: user.name, prflimg: user.prflimg, itemId : id.itemId, fantom : id.fantom }; // Format the response
          }));
          const combined = users.map(user => {
            var result = new search_result(user.fantom._id,user.fantom.desc,user.fantom.cover,user.user_id,user.name,user.userId, user.prflimg)
            return result
          });
          res.status(200).json(combined)
        })
}
const findByFmini  = async (req, res) => {
    Fmini.find({body : new RegExp(req.params.value, 'i') }).select({body : 1 , media : 1, refId : 1}).exec(async (err, fminis) => {
        const usrIds = fminis.map(fmini => ({
            userId: fmini.refId,
            itemId: fmini._id,
            fmini: fmini // Store the entire fmini object
          }));
        const users = await Promise.all(usrIds.map(async (id) => {
            const user = await Profile.findById(id.userId); // Find user by id
            return { user_id: user._id, userId: user.userId, name: user.name, prflimg: user.prflimg, itemId : id.itemId, fmini : id.fmini }; // Format the response
          }));
          const combined = users.map(user => {
            var result = new search_result(user.fmini._id,user.fmini.body,user.fmini.media,user.user_id,user.name,user.userId, user.prflimg)
            return result
          });
          res.status(200).json(combined)
        })
}

const findByTag = async (req, res) => {
 var fminis = await Fmini.find({ tags: { $elemMatch: { $regex: new RegExp(req.params.value, 'i') } } }).select({body : 1 , media : 1, refId : 1})
 var fantoms = await Fantom.find({tags : { $elemMatch : { $regex : new RegExp(req.params.value, 'i') } }}).select({title : 1, desc : 1, cover : 1, usrRefId : 1})

 const fmini_usrIds = fminis.map(fmini => ({
  userId: fmini.refId,
  itemId: fmini._id,
  fmini: fmini // Store the entire fmini object
}));

const fantom_usrIds = fantoms.map(fantom => ({
  userId: fantom.usrRefId,
  itemId: fantom._id,
  fantom: fantom // Store the entire fantom object
}));

var usrIds = fmini_usrIds.concat(fantom_usrIds)
var result
const users = await Promise.all(usrIds.map(async (id) => {
  const user = await Profile.findById(id.userId); // Find user by id
  var body, media;
  if(id.fmini == undefined){
    result = id.fantom
    body = result.desc
    media = result.cover
  }else if(id.fantom == undefined){
    result = id.fmini
    body = result.body
    media = result.media
  }

  return { user_id: user._id, userId: user.userId, name: user.name, prflimg: user.prflimg, itemId : id.itemId, result : result, body : body, media : media}; // Format the response
}));
const combined = users.map(user => {
  var result = new search_result(user.result._id, user.body,user.media,user.user_id,user.name,user.userId, user.prflimg)
  return result
});
res.status(200).json(combined)
}

const findByFeeling = async (req, res) => {
  var fminis = await Fmini.find({ mood: { $regex: new RegExp(req.params.value, 'i') }}).select({body : 1 , media : 1, refId : 1})
  var fantoms = await Fantom.find({feelings : { $regex: new RegExp(req.params.value, 'i') }}).select({title : 1, desc : 1, cover : 1, usrRefId : 1})
 
  const fmini_usrIds = fminis.map(fmini => ({
   userId: fmini.refId,
   itemId: fmini._id,
   fmini: fmini // Store the entire fmini object
 }));
 
 const fantom_usrIds = fantoms.map(fantom => ({
   userId: fantom.usrRefId,
   itemId: fantom._id,
   fantom: fantom // Store the entire fantom object
 }));
 
 var usrIds = fmini_usrIds.concat(fantom_usrIds)
 var result;
 const users = await Promise.all(usrIds.map(async (id) => {
   const user = await Profile.findById(id.userId); // Find user by id
   var media, body;
   if(id.fmini == undefined){
     result = id.fantom
     body = result.desc
     media = result.cover
   }else if(id.fantom == undefined){
     result = id.fmini
     body = result.body
     media = result.media
   }
   return { user_id: user._id, userId: user.userId, name: user.name, prflimg: user.prflimg, itemId : id.itemId, result : result, body : body, media : media}; // Format the response
 }));
 const combined = users.map(user => {
   var result = new search_result(user.result._id,user.body,user.media,user.user_id,user.name,user.userId, user.prflimg)
   return result
 });
 res.status(200).json(combined)
 }

 const findByCatagory  = async (req, res) => {
  var fminis = await Fmini.find({ catagory: { $regex: new RegExp(req.params.value, 'i') } }).select({body : 1 , media : 1, refId : 1})
  var fantoms = await Fantom.find({ catagory: { $regex: new RegExp(req.params.value, 'i') } }).select({title : 1, desc : 1, cover : 1, usrRefId : 1})
  
  const fmini_usrIds = fminis.map(fmini => ({
   userId: fmini.refId,
   itemId: fmini._id,
   fmini: fmini // Store the entire fmini object
 }));
 
 const fantom_usrIds = fantoms.map(fantom => ({
   userId: fantom.usrRefId,
   itemId: fantom._id,
   fantom: fantom // Store the entire fantom object
 }));
 
 var usrIds = fmini_usrIds.concat(fantom_usrIds)
 var result;
 var body, media
 const users = await Promise.all(usrIds.map(async (id) => {
   const user = await Profile.findById(id.userId); // Find user by id
   if(id.fmini == undefined){
     result = id.fantom
     body = result.desc
     media = result.cover
   }else if(id.fantom == undefined){
     result = id.fmini
     body = result.body
     media = result.media
   }
   return { user_id: user._id, userId: user.userId, name: user.name, prflimg: user.prflimg, itemId : id.itemId, result : result,body : body, media : media}; // Format the response
 }));
 const combined = users.map(user => {
  var result = new search_result(user.result._id,user.body,user.media,user.user_id,user.name,user.userId, user.prflimg)
  return result
 });
 res.status(200).json(combined)
}

const findRecent = async (req, res) => {
  var fminis = await Fmini.find({body : new RegExp(req.params.value, 'i') }).sort({ createdAt: -1 }).select({body : 1 , media : 1, refId : 1})
  var fantoms = await Fantom.find({title : new RegExp(req.params.value, 'i') }).sort({createdAt : -1}).select({title : 1, desc : 1, cover : 1, usrRefId : 1})
 
  const fmini_usrIds = fminis.map(fmini => ({
   userId: fmini.refId,
   itemId: fmini._id,
   fmini: fmini // Store the entire fmini object
 }));
 
 const fantom_usrIds = fantoms.map(fantom => ({
   userId: fantom.usrRefId,
   itemId: fantom._id,
   fantom: fantom // Store the entire fantom object
 }));
 
 var usrIds = fmini_usrIds.concat(fantom_usrIds)
 var result;
 const users = await Promise.all(usrIds.map(async (id) => {
   const user = await Profile.findById(id.userId); // Find user by id
   var body, media
   if(id.fmini == undefined){
     result = id.fantom
   }else if(id.fantom == undefined){
     result = id.fmini
     body = result.body
     media = result.media
   }
   return { user_id: user._id, userId: user.userId, name: user.name, prflimg: user.prflimg, itemId : id.itemId, result : result, body : body, media : media}; // Format the response
 }));
 const combined = users.map(user => {
  var result = new search_result(user.result._id,user.body,user.media,user.user_id,user.name,user.userId, user.prflimg)
  return result
 });
 res.status(200).json(combined)
  }

 const findTrending = async (req, res) => {
  var fminis = await Fmini.find({body : new RegExp(req.params.value, 'i') }).sort({ "reactions.length": -1 }).select({body : 1 , media : 1, refId : 1})
  var fantoms = await Fantom.find({title : new RegExp(req.params.value, 'i') }).sort({ "reactions.length": -1 }).select({title : 1, desc : 1, cover : 1, usrRefId : 1})
 
  const fmini_usrIds = fminis.map(fmini => ({
   userId: fmini.refId,
   itemId: fmini._id,
   fmini: fmini // Store the entire fmini object
 }));
 
 const fantom_usrIds = fantoms.map(fantom => ({
   userId: fantom.usrRefId,
   itemId: fantom._id,
   fantom: fantom // Store the entire fantom object
 }));
 
 var usrIds = fmini_usrIds.concat(fantom_usrIds)
 var result;
 const users = await Promise.all(usrIds.map(async (id) => {
   const user = await Profile.findById(id.userId); // Find user by id
   var body, media

   if(id.fmini == undefined){
     result = id.fantom
     body = result.desc
     media = result.cover
   }else if(id.fantom == undefined){
     result = id.fmini
     body = result.body
     media = result.media
   }

   return { user_id: user._id, userId: user.userId, name: user.name, prflimg: user.prflimg, itemId : id.itemId, result : result, body : body, media : media}; // Format the response
 }));
 const combined = users.map(user => {
  var result = new search_result(user.result._id,user.body,user.media,user.user_id,user.name,user.userId, user.prflimg)
  return result
 });
 res.status(200).json(combined)
  }
  const findByUser = async (req, res) => {
    var fminis = await Fmini.find({refId : req.body.user_id}).limit(30).select({body : 1 , media : 1, refId : 1})
    var fantoms = await Fantom.find({usrRefId : req.body.user_id}).limit(30).select({title : 1, desc : 1, cover : 1, usrRefId : 1})
   
    const fmini_usrIds = fminis.map(fmini => ({
     userId: fmini.refId,
     itemId: fmini._id,
     fmini: fmini // Store the entire fmini object
   }));
   
   const fantom_usrIds = fantoms.map(fantom => ({
     userId: fantom.usrRefId,
     itemId: fantom._id,
     fantom: fantom // Store the entire fantom object
   }));
   
   var usrIds = fmini_usrIds.concat(fantom_usrIds)
   var result;
   const users = await Promise.all(usrIds.map(async (id) => {
     const user = await Profile.findById(id.userId); // Find user by id
     var media, body
     if(id.fmini == undefined){
       result = id.fantom
       body = result.desc
       media = result.cover
     }else if(id.fantom == undefined){
       result = id.fmini
       body = result.body
       media = result.media
     }
     return { user_id: user._id, userId: user.userId, name: user.name, prflimg: user.prflimg, itemId : id.itemId, result : result, body : body, media : media}; // Format the response
   }));
   const combined = users.map(user => {
    var result = new search_result(user.result._id,user.body,user.media,user.user_id,user.name,user.userId, user.prflimg)
    return result
   });
   res.status(200).json(combined)
   }
module.exports = { findByFantom, findByFmini, findByTag, findByFeeling, findByCatagory, findRecent, findTrending, findByUser}