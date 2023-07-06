const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const Fmini = mongoose.model('Fmini')
const Message = mongoose.model('Message')
const Profile = mongoose.model('Profile')
const Fantom = mongoose.model('Fantom')
const Report = mongoose.model('Report')
const follow = async (req, res) => {
  const following = Profile.findById(req.body.following)
  const follower = Profile.findById(req.body.follower)
  var session = await mongoose.startSession()
  try{
    await session.withTransaction( async ()=> {
      following.followers.push(req.body.follower)
      follower.following.push(req.body.following)
    })
  }catch(err){
    console.log(err)
  }finally{
    console.log('follow request completed')
    res.status(202).json('ok')
  }
}
const fmini = async (req, res) => {
    const fmini = new Fmini();
    const profile = await Profile.findById(req.body.refId)
    var session = await mongoose.startSession()
    try{
      await session.withTransaction( async()=>{

        fmini._id = new mongoose.Types.ObjectId
        fmini.userName = req.body.userName;
        fmini.userId = req.body.userId;
        fmini.refId = req.body.refId
        fmini.media = req.body.media;
        fmini.body = req.body.body;
        fmini.mood = req.body.mood;
        fmini.tags = req.body.tags;
        fmini.catagory = req.body.catagory;
        fmini.settings = req.body.settings;
      fmini.save((err)=>{
        if(err){
            console.log(err)
        }else{
            res.status(201).json('ok')
        }
      })
      profile.fanotmMini.push(fmini._id)
      })
    }catch(err){

    }finally{

    }

}
const pmsg = (req, res) => {
  const message = new Message();
  message.message = req.body.body.message;
  message.from = req.body.body.from;
  message.to = req.body.body.to;
  message.save((err)=>{
    if(err){
      console.log(err)
    }else{
      res.status(201).json(message)
    }
  })
}
const gmsg = (req, res) => {
   Message.find( {$or:[{$and:[{from : req.body.from}, {to : req.body.to}]},{$and:[{from : req.body.to}, {to : req.body.from}]}]}).then( (m)=>
   
    res.status(200).json(m)
   )
}
const getUser = async (req, res ) =>{
  const user = await Profile.findById(req.params.usrRefId)
  res.status(200).json(user)
}
const users = async (req, res) => {
  let payload = req.params.userId
  const search = await Profile.find({userId : {$regex : new RegExp('^' + payload + '.*', 'i')}}).select({name : 1, userId : 1, prflimg: 1}).exec()
  results = search.slice(0,10)
  res.send({payload: results})
} // using in message recipient search
const updtMsgStats = async (req, res) => {
  await Message.updateMany({$and:[{from : req.body.there}, {to : req.body.here}]}, { $set:{status : 'seen'}}).then(()=> res.status(200).json('ok')).catch(err => console.log(err))
}
const dltmsg = (req, res) => {
  Message.findByIdAndDelete(req.body.id).then(()=> res.status(200).json('deleted')).catch(e => console.log(e))
}
const chapterPost = async (req, res) =>{
  var newChapter = {
    title : req.body.title,
    chapter : req.body.chapter
  }
  Fantom.findById(req.params.fmId, (err, fantom) => {
    if (err) {
      console.log(err)
    } else {
      fantom.chapters.push(newChapter);
      fantom.save((err, updatedFantom) => {
        if (err) {
          console.log(err)
        } else {
          res.status(201).json('ok')
        }
      });
    }
  })
}
const fantom = (req, res) => {
const fantom = new Fantom();
       fantom._id = new mongoose.Types.ObjectId(),
       fantom.userId = req.body.userId,
       fantom.userName = req.body.userName,
       fantom.title = req.body.title,
       fantom.desc = req.body.desc,
       fantom.tags = req.body.tags,
       fantom.catagory = req.body.catagory,
       fantom.prota = req.body.prota,
       fantom.anta = req.body.anta,
       fantom.deuta = req.body.deuta,
       fantom.tert = req.body.tert,
       fantom.feelings = req.body.feelings,
       fantom.age_rating = req.body.age_rating,
       fantom.who_can_see = req.body.who_can_see,
       fantom.post_as = req.body.post_as,
       fantom.backGround = req.body.backGround,
       fantom.cover = req.body.cover,
       fantom.usrRefId = req.body.usrRefId
fantom.save((err)=>{
if(err){
    console.log(err)
}else{
    res.status(201).json(fantom._id.toString())
}
})
}
function findTargetReply(target, parentId) {
  for (const item of target) {
    if(item._id.toString() == parentId || item._id == parentId){
      return item;
    } else {
      for (var reply of item.replies){
        if (reply._id == parentId) {
          return reply;
        } else if (reply.replies && reply.replies.length){
          const foundReply = findTargetReply(reply.replies, parentId);
          if (foundReply) {
            return foundReply;
          }
        }
      }
    } 
  }
  return null;
}
const getFminiRxns = async (req, res) => {
  const fmini = await Fmini.findOne({_id: req.params.fminiId})
  var parentId = req.params.parentId
  var parent
  if(req.params.fminiId == req.params.parentId){
  parent = fmini
  }else if(fmini.replies.id(parentId)){
    parent = fmini.replies.id(parentId)
  }else if(fmini.annexes.id(parentId)){
    parent = fmini.annexes.id(parentId)
  }else if(fmini.alters.id(parentId)){
    alters = fmini.alters.id(parentId)
  }else{
    parent = findTargetReply(fmini.replies, parentId)
  }

  if(parent == undefined){
    parent = findTargetReply(fmini.annexes, parentId)
  }

  if(parent == undefined){
    parent = findTargetReply(fmini.alters, parentId)
  }
  console.log(parent.reactions)
  const usrRefIds = parent.reactions.map(reaction => reaction.usrRefId);
  await Profile.find({ _id: { $in: usrRefIds } }, { name: 1, userId: 1 , prflimg:1}).then(users => {
      const userMap = new Map();
      users.forEach(user => {
        userMap.set(user._id.toString(), user);
      });
      const combined = parent.reactions.map(reaction => {
        const user = userMap.get(reaction.usrRefId);
        return { ...reaction.toObject(), user: user.toObject() };
      });
      res.status(200).json(combined)
    });
   
} // fminis and its replies
const getFantomRxns = async (req, res) => {
  const fantom = await Fantom.findOne({_id: req.params.fantomId})
  var parentId = req.params.parentId
  var parent
  if(req.params.fminiId == req.params.parentId){
  parent = fantom
  }else if(fantom.replies.id(parentId)){
    parent = fantom.replies.id(parentId)
  }else{
    parent = findTargetReply(fantom.replies, parentId)
  }
  console.log(parent.reactions)
  const usrRefIds = parent.reactions.map(reaction => reaction.usrRefId);
  await Profile.find({ _id: { $in: usrRefIds } }, { name: 1, userId: 1 , prflimg:1}).then(users => {
      const userMap = new Map();
      users.forEach(user => {
        userMap.set(user._id.toString(), user);
      });
      const combined = parent.reactions.map(reaction => {
        const user = userMap.get(reaction.usrRefId);
        return { ...reaction.toObject(), user: user.toObject() };
      });
      res.status(200).json(combined)
    });
   
} //fantom and its replies
async function postRxn(req, res) {
  const fmini = await Fmini.findOne({_id: req.body.targetId})
  const fantom = await Fantom.findOne({_id: req.body.targetId})
  const profile = await Profile.findById(req.body.usrRefId)
  var parentId = req.body.parentId
  var parent
  if(fantom == null || undefined){
  parent = fmini
  }else if(fmini == null || undefined){
    parent = fantom
  }else if(fmini.replies.id(parentId)){
    parent = fmini.replies.id(parentId)
  }else if(fantom.replies.id(parentId)){
    parent = fantom.replies.id(parentId)
  }else if(fmini.annexes.id(parentId)){
    parent = fmini.annexes.id(parentId)
  }else if(fmini.alters.id(parentId)){
    alters = fmini.alters.id(parentId)
  }else{
    parent = findTargetReply(fmini.replies, parentId)
  }

  if(parent == undefined){
    parent = findTargetReply(fmini.annexes, parentId)
  }

  if(parent == undefined){
    parent = findTargetReply(fmini.alters, parentId)
  }
  
  if(parent == undefined){
    parent = findTargetReply(fantom.replies, parentId)
  }
     var session = await mongoose.startSession();
     try{
      await session.withTransaction( async()=>{
        if(parent.likes && parent.likes.length){ // likes exists
          for(var usrRefId of parent.likes){
            if(usrRefId == req.body.usrRefId){  // user already liked
              parent.likes.pull(usrRefId)
              profile.likes.pull(parent._id)
              await parent.save()
              await profile.save()
            }else{
              parent.likes.push(req.body.usrRefId)
              profile.likes.push(parent._id)
              await parent.save()
              await profile.save()
            }
          }
        }else{ // new reaction
          parent.likes.push(req.body.usrRefId)
          profile.likes.push(parent._id)
          await parent.save()
          await profile.save()
        }
      })
     }catch(e){
      console.log(e)
     }finally{
      session.endSession()
     }
}
const postToTarget = async (req, res) => {
  console.log(req.body)
  var to;
   if(req.body.to == 'fmini'){
     to = await Fmini.findOne({ _id: req.body.toId });
   }else{
   to = await Fantom.findOne({ _id: req.body.toId });
   }
  const profile = await Profile.findById(req.body.usrRefId);
  if(req.body.media){
    var media = req.body.media
  }else{
    var media = undefined
  }

  switch (req.body.target) {
    case 'annex':
      target = to.annexes
      var usrTarget = profile.annexes
      break;
      case 'reply':
        target = to.replies
        var usrTarget = profile.replies
        break;
        case 'alter':
          target = to.alters
          var usrTarget = profile.alters
          break;        
    default:
      console.log('something went wrong')
      break;
  }
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async ()=> {
      const obj = {
        _id: new mongoose.Types.ObjectId(),
    body : req.body.body,
    media : media,
    usrRefId : req.body.usrRefId,
    toRefId : req.body.toId
      }
      target.push(obj);
      await to.save();
      const objId = obj._id.toString();
      usrTarget.push(objId);
      await profile.save();
    })
    res.status(200).json('done');
    console.log('Transaction committed successfully');
  }catch(error){
    console.error('Transaction aborted:', error);
    res.status(500).json('Error');
  }finally{
    session.endSession();
  }
}
const postCommonReply = async (req, res) => {
  const session = await mongoose.startSession();
  var fminiId = req.body.fminiRefId;
  var fmini = await Fmini.findById(fminiId).session(session);
  var parentId = req.body.parentId
  var parent;
  
   if(fmini.replies.id(parentId)){
    parent = fmini.replies.id(parentId)
   }
   else if(fmini.annexes.id(parentId)){
    parent = fmini.annexes.id(parentId)
   }
   else if(fmini.alters.id(parentId)){
    parent = fmini.alters.id(parentId)
   }else{
    parent = findTargetReply(fmini.replies,parentId)
   }
   
   if(parent == undefined){
      parent = findTargetReply(fmini.annexes,parentId)
      console.log('annex parent:', parent)
   }
 
   if(parent == undefined){
    parent = findTargetReply(fmini.alters,parentId)
    console.log('parent : ', parent)
   }
  try {
    await session.withTransaction(async () => {
        const newReply = {
          _id: new mongoose.Types.ObjectId(),
          body: req.body.reply,
          media: req.body.media,
          usrRefId: req.body.refId,
          fminiRefId: req.body.fminiRefId
        };
        parent.replies.push(newReply);
        await fmini.save();

        const profile = await Profile.findOne({ userRefId: req.body.refId }).session(session);

        const newReplyId = newReply._id.toString();
        profile.replies.push(newReplyId);
        await profile.save();
        res.status(200).json(newReply);
    });
    console.log('Transaction successful');
  } catch (error) {
    console.log('Transaction aborted:', error);
    res.status(500).send('Transaction aborted');
  } finally {
    session.endSession();
  }  
}
const getNestedReply = async (req, res) => {
  const fmini = await Fmini.findById(req.params.fminiId);
  var parentId = req.params.parentId
  var parent ;
  if (!fmini) {
    console.log('no fmini found with given id')
  }
  try{
    if(fmini.replies.id(parentId)){
      parent = fmini.replies.id(parentId)
     }
     else if(fmini.annexes.id(parentId)){
      parent = fmini.annexes.id(parentId)
     }
     else if(fmini.alters.id(parentId)){
      parent = fmini.alters.id(parentId)
     }else{
      parent = findTargetReply(fmini.replies, parentId)
    }

    if(parent == undefined){
      parent = findTargetReply(fmini.annexes, parentId)
    }

    if(parent == undefined){
      parent = findTargetReply(fmini.alters, parentId)
    }
    if (!parent) {
     console.log('no parent element found with given id')
    }
    const nestedReplies = parent.replies;
    res.status(200).json(nestedReplies)
  }catch(error){
     console.error(error);
  }
}
const fminiFeed =  async (req, res) => {
 await Fmini.find({'settings.whoCanSee' : 'public'}).limit(50).then( resp =>{
  res.json(resp).status(200)
 })
}
const getFmini = (req, res) =>{
  Fmini.findById(req.params.id).select({tags : 1, refId : 1, media :1, body : 1, mood : 1, catagory : 1, userId : 1, userName : 1, reactions : 1, replies : 1, annexes : 1, alters : 1}).exec((err, fmini) =>{
    res.status(200).json(fmini)
  })
}
const getUsers = async (req, res) => {
  
  try {
    const users = await Promise.all(req.body.usrIds.map(async (id) => {
      const user = await Profile.findById(id[0]); // Find user by id
      return { user_id: user._id, userId: user.userId, name: user.name, prflimg: user.prflimg, itemId : id[1] }; // Format the response
    }));
    res.status(200).json(users)
  } catch (err) {
    console.error(err);
  }
}
const getUsers2 = async (req, res) => {
  
  try {
    const users = await Promise.all(req.body.usrIds.map(async (id) => {
      const user = await Profile.findById(id); // Find user by id
      return { user_id : user._id, userId: user.userId, name: user.name, prflimg: user.prflimg}; // Format the response
    }));
    res.status(200).json(users)
  } catch (err) {
    console.error(err);
  }
}
const fantoms = (req, res) => {
  Fantom.find({ "who_can_see": "public" }, '-body -whoCanSee').limit(40).exec((err, fantoms) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
      } else {
        res.status(200).json(fantoms);
      }
    });
};

const getFantom = (req, res) =>{
  Fantom.findById(req.params.id, 'body reply reactions title' ,  (err, fantom) =>{
    res.status(200).json(fantom)
  })
}
const fmDl = (req, res) =>{
  Fantom.findById(req.params.id, '-body' ,  (err, fantom) =>{
    res.status(200).json(fantom)
  })
}
const fmsDl = (req, res)=>{
  Fantom.find({usrRefId : req.params.id}, 'title desc cover', (err, fantoms)=>{
    res.status(200).json(fantoms)
  })
}
const fminisDl = (req, res)=>{ 
  Fmini.find({refId : req.params.id},{ _id: 1, body: 1, media: 1, 'settings.postAs' : 1, tags : 1, mood : 1, catagory : 1, timeStamp : 1 }, (err, fminis) =>{
    if(err){
      console.log(err)
    }else{
      res.status(200).json(fminis)      
    }
  })
}
var allReplies = []
const getAllReplies = async () => {
  try {
    const fminis = await Fmini.find({});
    for (const fm of fminis) {
      for (const reply of fm.replies) {
        allReplies.push(reply);
        if (reply.replies) {
          findSubReply(reply);
        }
      }
      for (const annex of fm.annexes) {
        if (annex.replies && annex.replies.length) {
          findSubReply(annex);
        }
      }
      for (const alter of fm.alters) {
        if (alter.replies && alter.replies.length) {
          findSubReply(alter);
        }
      }
    }
    return allReplies
  } catch (error) {
    console.error(error);
  }
};

function findSubReply(targetReply) {
  for (const reply of targetReply.replies) {
    allReplies.push(reply);
    if (reply.replies) {
      findSubReply(reply);
    }
  }
}
const usrReplies = async (req, res) => {
  const userId = req.params.id;
  try {
    const allReplies = await getAllReplies();
    const userReplies = allReplies.filter(reply => reply.usrRefId === userId);
    res.status(200).json(userReplies)
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while fetching replies.');
  }
};
const usrAnnexes = async (req, res) =>{
  var usrAnnexes = []
  const fm = await Fmini.find({})
   for(var fmini of fm){
     for(var annex of fmini.annexes){
      if(annex.usrRefId = req.params.id){
        usrAnnexes.push(annex)
      }
     }
   }
   res.status(200).json(usrAnnexes)
}
const usrLikes = async (req, res) =>{
  const userId = req.params.id;

  // Query likes in fantom
  const Fantom = mongoose.model('Fantom');
  const fantomLikes = await Fantom.find({ likes: userId }).exec();
  const fantomRepliesLikes = await Fantom.find({ 'replies.likes' : userId}).exec();
  
  // Query likes in fmini
  const Fmini = mongoose.model('Fmini');
  const fminiLikes = await Fmini.find({ likes: userId }).exec();
  
  // Query likes in alters within fmini
  const fminiAltersLikes = await Fmini.find({ 'alters.likes': userId }).exec();
  
  // Query likes in annexes within fmini
  const fminiAnnexesLikes = await Fmini.find({ 'annexes.likes': userId }).exec();
  
  // Query likes in replies within fmini
  const fminiRepliesLikes = await Fmini.find({ 'replies.likes': userId }).exec();
  
  // Combine all results into a single array
  const allLikes = [
    ...fantomLikes,
    ...fantomRepliesLikes,
    ...fminiLikes,
    ...fminiAltersLikes,
    ...fminiAnnexesLikes,
    ...fminiRepliesLikes,
  ];
  var likes = [];

  for(var post of allLikes){
    var _id, parent,body, media, usrRefId, replies_length , alters_length, annexes_length, likes_length;
    _id = post._id
    replies_length = post.replies.length
    likes_length = post.likes.length
    if(post.body){ // body
      body = post.body
    }else{
      body = post.desc
    }
    if(post.media){ // media
      media = post.media
    }else if(post.cover){
      media = post.cover
    }else{
      media = null
    }
    if(post.usrRefId){
      usrRefId = post.usrRefId
    }else{
      usrRefId = post.refId
    }
    if(post.alters){
      alters_length = post.alters.length
    }
    if(post.annexes){
      annexes_length = post.annexes.length
    } 
    if(post.cover){
      parent = 'fantom'
    }else if(post.annexes){
      parent = 'fmini'
    }else{
      parent = 'alenrep'
    }
    var item = {
      _id : _id,
      body : body, 
      media : media,
      usrRefId : usrRefId,
      replies_length : replies_length,
      alters_length : alters_length,
      annexes_length : annexes_length,
      likes_length : likes_length,
      parent : parent
    }
    likes.push(item)
  }
  res.status(200).json(likes)
}
const usrAlters = async (req, res) =>{
  var usrAlters = []
  const fm = await Fmini.find({})
   for(var fmini of fm){
     for(var alter of fmini.alters){
      if(alter.usrRefId = req.params.id){
        usrAlters.push(alter)
      }
     }
   }
   res.status(200).json(usrAlters)
}
const topUsers = async ( req, res) =>{
  const topUsersQuery = Profile.aggregate([
    {
      $match: {
        "settings.profile_visibility": false,
      },
    },
    {
      $project: {
        name: 1,
        userId : 1,
        prflimg : 1,
        fantomsCount: { $size: "$fantoms" },
        fantomMinisCount: { $size: "$fantomMini" },
        // Add other fields you want to consider for top users
      },
    },
    {
      $sort: {
        fantomsCount: -1, // Sort in descending order of fantoms count
        fantomMinisCount: -1, // Sort in descending order of fantomMinis count
        // Add other fields you want to sort by
      },
    },
    {
      $limit: 10, // Specify the number of top users you want to retrieve
    },
  ]);
  
  topUsersQuery.exec((err, topUsers) => {
    if (err) {
      // Handle error
    } else {
      res.status(200).json(topUsers)
      // console.log(topUsers);
    }
  });
  
  // try{
  //   const users = await Profile.find({
  //     followers: { $size: { $gt: 2 } },
  //     followers: { $nin: [req.params.id] } // exclude users with the given name in their followers array
  //   });
  //   res.status(200).json(users)
  // }catch(err){
  //   console.log(err)
  // }
}
const report = async (req, res) => {
  var report = new Report()
  report.report = req.body.report
  report.reported_user = req.body.reported_user
  report.reporting_user = req.body.reporting_user
  report.detail = req.body.detail
  report.save((err)=>{
    if(err){
      console.log(err)
    }else{
      res.status(201).json('ok')
    }
  })
}
const saveSettings = async (req, res) => {
    console.log(req.body.blocked_users);
    req.body.blocked_users.forEach(id => {
    console.log(id)
  })
  const decoded = jwt.verify(req.cookies.indigotoken, process.env.JWT_SECRET)
  var profile = await Profile.findById(decoded._id)
  console.log(req.body)
  profile.settings.profile_visibility = req.body.profile_visibility
  profile.settings.direct_message = req.body.direct_message
  profile.settings.hide_sensitivity = req.body.hide_sensitivity
  profile.settings.blocked_users = req.body.blocked_users;
  profile.save((err)=>{
    if(err){
      console.log(err)
    }else{
      res.status(201).json('ok')
    }
  })
}
const chapter = async (req, res) => {
  const fantom = await Fantom.findById(req.params.fmId)
  const chapter = await fantom.chapters.id(req.params.chapterId)
  const fantom_infos = await Fantom.findById(req.params.fmId).select({replies : 1, reactions : 1, usrRefId : 1})
  res.status(200).json({chapter : chapter, fantom_infos : fantom_infos})
}
const chatHistory = async (req, res) => {
  try {
    const chat = await Message.find({ from: req.params.usrRefId });
    var users = [];

    for (const doc of chat) {
      var user = await Profile.find({ userId: doc.to }).select({
        name: 1,
        userId: 1,
        prflimg: 1,
        _id: 1,
      });

      const userExists = users.some((item) => item[0].userId === user[0].userId);

      if (!userExists) {
        users.push(user);
      }
    }

    res.status(200).json(users);
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
 chatHistory, usrLikes,follow,chapter,chapterPost,saveSettings, report, postToTarget, fmini,users,getUser, pmsg,gmsg, updtMsgStats,dltmsg,fantom, postRxn, fminiFeed, getFmini, getUsers,getUsers2,postCommonReply, getNestedReply, fantoms, getFantom ,fmDl, fmsDl, fminisDl, usrReplies, usrAnnexes, usrAlters, getFantomRxns, getFminiRxns, topUsers
}
