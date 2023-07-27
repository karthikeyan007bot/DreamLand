var express = require('express');
const router = express.Router()
const axios = require('axios')
const jwt = require('jsonwebtoken')
var moment = require('moment');
var server= {
  url : 'https://dreamverse.onrender.com'
}
class user{
  constructor(name, id, following, followers, prflimg){
    this.name  = name;
    this.id = id ;
    this.following = following ;
    this.followers = followers ;
    this.prflimg = prflimg
  }
  }
   const fantoms = (req, res) => {
    if(req.cookies.indigotoken){
      const decoded = jwt.verify(req.cookies.indigotoken, process.env.JWT_SECRET)
      axios.get(`${server.url}/api/fantoms`).then(resp => { // to get users of each fmini who are referenced by their Id
        var usrIds = []
        resp.data.forEach(fantom => {
          usrIds.push([fantom.usrRefId, fantom._id])
        });
        axios.post(`${server.url}/api/users`,{
          usrIds : usrIds
        }).then( (response) => {
          const combined = response.data.map(user => {
            const matchingFmini = resp.data.find(fantom => fantom._id === user.itemId);
            return { ...user, ...matchingFmini };
          });
            axios.get(`${server.url}/api/user/${decoded._id}`).then( resp => { // gets information about user
              var User =  new user(resp.data.name, resp.data.userId, resp.data.following, resp.data.followers, resp.data.prflimg)
              res.render('home2',{ fantoms : combined, user : User})           
            })
        }).catch(err => console.log(err))
      })
    }else{
      res.render('signin')
    }
   }

   const chapter = async (req, res) =>{
    try{
      const decoded = jwt.verify(req.cookies.indigotoken, process.env.JWT_SECRET);
      const response = await axios.get(`${server.url}/api/user/${decoded._id}`);
      const User = new user(response.data.name, response.data.userId, response.data.following, response.data.followers, response.data.prflimg); 
      const fantom = await axios.get(`${server.url}/api/${req.params.fmId}/chapter/${req.params.chapterId}`)
      const fantom_user = await axios.get(`${server.url}/api/user/${fantom.data.fantom_infos.usrRefId}`);
      res.render('chapter', {chapter : fantom.data.chapter, user : User, fantom_user : fantom_user.data,fantom_infos : fantom.data.fantom_infos})
    }catch(err){
      console.log(err)
    }
   }
  //  Fantom description page
   const fmDl =async (req, res) =>  { 
    const decoded = jwt.verify(req.cookies.indigotoken, process.env.JWT_SECRET);
    const response = await axios.get(`${server.url}/api/user/${decoded._id}`);
    const User = new user(response.data.name, response.data.userId, response.data.following, response.data.followers, response.data.prflimg);    
    axios.get(`${server.url}/api/fantom/detail/${req.params.id}`).then( async (resp) => {
      const fantom_user = await axios.get(`${server.url}/api/user/${resp.data.usrRefId}`)
      if(decoded._id == response.data._id){
        res.render('fmDl', { fantom : resp.data, user : User, fantom_user : fantom_user.data, owner : User})
      }else{
        res.render('fmDl', { fantom : resp.data, user : User, fantom_user : fantom_user.data})
      }
    }) 
  }
  const fminiFeed = (req, res) => {
    if(req.cookies.indigotoken){
      const decoded = jwt.verify(req.cookies.indigotoken, process.env.JWT_SECRET)
      axios.get(`${server.url}/api/fminiFeed`).then(resp => { // to get users of each fmini who are referenced by their Id
        var usrIds = []
        resp.data.forEach(fmini => {
          if(fmini.settings.whoCanSee != 'anonymous'){
            usrIds.push([fmini.refId, fmini._id])
          }
        });
        axios.post(`${server.url}/api/users`,{
          usrIds : usrIds
        }).then( (response) => {
          const combined = response.data.map(user => {
            const matchingFmini = resp.data.find(fmini => fmini._id === user.itemId);
            return { ...user, ...matchingFmini };
          });
            axios.get(`${server.url}/api/user/${decoded._id}`).then( resp => { // gets information about user
              var User =  new user(resp.data.name, resp.data.userId, resp.data.following, resp.data.followers, resp.data.prflimg)
              res.render('home',{ fminis : combined, user : User})           
            })
        }).catch(err => console.log(err))
      })
    }else{
      res.render('welcome')
    }
  }
  const error = (req, res) => {
    res.render('error', {title : 'error'})
  }
  const annexures = async (req, res) => {
    const decoded = jwt.verify(req.cookies.indigotoken, process.env.JWT_SECRET);
    const resp = await axios.get(`${server.url}/api/user/${decoded._id}`);
    const User = new user(resp.data.name, resp.data.userId, resp.data.following, resp.data.followers, resp.data.prflimg);
    axios.get(`${server.url}/api/${req.params.id}/annexures`).then((resp) => {
      var usrIds = []
      resp.data.annexes.forEach(annex => {
        usrIds.push([annex.usrRefId, annex._id])
      });
      axios.post(`${server.url}/api/users`,{
        usrIds : usrIds
      }).then( (response) => {
        const combined = response.data.map(user => {
          const matchingReply = resp.data.annexes.find(annex => annex._id === user.itemId);
          return { ...user, ...matchingReply };
        });
        res.render('alanrep', {annexes : combined, user : User})
            }).catch(err => console.log(err))
    })
  }
  const replies = async (req, res) => {
    const decoded = jwt.verify(req.cookies.indigotoken, process.env.JWT_SECRET);
    const resp = await axios.get(`${server.url}/api/user/${decoded._id}`);
    const User = new user(resp.data.name, resp.data.userId, resp.data.following, resp.data.followers, resp.data.prflimg);
    axios.get(`${server.url}/api/${req.params.id}/replies`).then((resp) => {
      var usrIds = []
      resp.data.replies.forEach(reply => {
        usrIds.push([reply.usrRefId, reply._id])
      });
      axios.post(`${server.url}/api/users`,{
        usrIds : usrIds
      }).then( (response) => {
        const combined = response.data.map(user => {
          const matchingReply = resp.data.replies.find(reply => reply._id === user.itemId);
          return { ...user, ...matchingReply };
        });

        res.render('alanrep', {replies : combined, user : User})
            }).catch(err => console.log(err))
    })
  }
  const alters = async (req, res) => {
    const decoded = jwt.verify(req.cookies.indigotoken, process.env.JWT_SECRET);
    const resp = await axios.get(`${server.url}/api/user/${decoded._id}`);
    const User = new user(resp.data.name, resp.data.userId, resp.data.following, resp.data.followers, resp.data.prflimg);
    axios.get(`${server.url}/api/${req.params.id}/alters`).then((resp) => {
      var usrIds = []
      resp.data.alters.forEach(alter => {
        usrIds.push([alter.usrRefId, alter._id])
      });
      axios.post(`${server.url}/api/users`,{
        usrIds : usrIds
      }).then( (response) => {
        const combined = response.data.map(user => {
          const matchingReply = resp.data.alters.find(alter => alter._id === user.itemId);
          return { ...user, ...matchingReply };
        });
      res.render('alanrep', {alters : combined, user : User})
            }).catch(err => console.log(err))
    })
  }
  const nestedReplies = async (req, res) => {
    const decoded = jwt.verify(req.cookies.indigotoken, process.env.JWT_SECRET);
    const resp = await axios.get(`${server.url}/api/user/${decoded._id}`);
    const User = new user(resp.data.name, resp.data.userId, resp.data.following, resp.data.followers, resp.data.prflimg);    
    axios.get(`${server.url}/api/${req.params.fminiId}/${req.params.parentId}/nestedReplies`).then((resp) => {
      if(resp.data == []){
        res.render('alanrep', {nothing : 'replies'})
      }else{
        var usrIds = []
        resp.data.forEach(reply => {
          usrIds.push([reply.usrRefId, reply._id])
        });
        axios.post(`${server.url}/api/users`,{
          usrIds : usrIds
        }).then( (response) => {
          const combined = response.data.map(user => {
            const matchingReply = resp.data.find(reply => reply._id === user.itemId);
            return { ...user, ...matchingReply };
          });
        res.render('alanrep', {replies : combined, replyId : req.params.replyId, user : User})
              }).catch(err => console.error(err))
      }
    })
  }
  const fmini = async (req, res) => {
    try {
      const decoded = jwt.verify(req.cookies.indigotoken, process.env.JWT_SECRET);
      const response = await axios.get(`${server.url}/api/fmini/${req.params.id}`);
      const re = await axios.get(`${server.url}/api/user/${response.data.refId}`);
      const resp = await axios.get(`${server.url}/api/user/${decoded._id}`);
      const User = new user(resp.data.name, resp.data.userId, resp.data.following, resp.data.followers, resp.data.prflimg);
      res.render('fmini', { fmini: response.data, user: User, fmini_user: re.data });
    } catch (err) {
      console.log(err);
    }
  };
  const drmpost = (req, res) => {
    const decoded = jwt.verify(req.cookies.indigotoken, process.env.JWT_SECRET)
    axios.get(`${server.url}/api/user/${decoded._id}`).then( resp => { // gets information about user
      var User = {
        name : resp.data.name,
        id : resp.data.userId,
        prflimg : resp.data.prflimg
      }
      console.log(User)
      res.render('dream-post',{user : User, title : 'Fantom'})           
    })
  }
  const find = (req, res) => {
    if(req.cookies.indigotoken){
      const decoded = jwt.verify(req.cookies.indigotoken, process.env.JWT_SECRET)
      axios.get(`${server.url}/api/user/${decoded._id}`).then( resp => { // gets information about user
        var User =  new user(resp.data.name, resp.data.userId, resp.data.following, resp.data.followers, resp.data.prflimg)
        console.log(User)
        res.render('find',{user : User})           
      })
    }else{
      res.render('signin')
    }
  }
  const messages = async (req, res) => {
    const decoded = jwt.verify(req.cookies.indigotoken, process.env.JWT_SECRET)
    axios.get(`${server.url}/api/user/${decoded._id}`).then( async resp => { // gets information about user
    var chat_history = await axios.get(`${server.url}/api/chat_history/${decoded.userId}`)
      var User =  new user(resp.data.name, resp.data.userId, resp.data.following, resp.data.followers, resp.data.prflimg)
     console.log(chat_history.data)
      res.render('messages',{user : User, chat_history : chat_history.data})           
    })
  }
  const message = async (req, res) => {
    const decoded = jwt.verify(req.cookies.indigotoken, process.env.JWT_SECRET)
    console.log(decoded.userId)
    var resp = await axios.get(`${server.url}/api/user/${decoded._id}`);
    var to_user = await axios.get(`${server.url}/api/userByUserId/${req.params.id}`);
    var User =  new user(resp.data.name, resp.data.userId, resp.data.following, resp.data.followers, resp.data.prflimg)
    var resp = await axios.post(`${server.url}/api/gmsg`, {
      from : decoded.userId,
      to : req.params.id   
    })

    res.render('message', {from : decoded.userId, to : req.params.id, name : req.params.name, data : resp.data, user : User, to_user : to_user.data.payload[0]})


  }
  const notifications = (req, res) => {
    res.render('notifications', {title : 'notifications'})
  }
  const getChapterPostPage = async (req, res) => {
    const decoded = jwt.verify(req.cookies.indigotoken, process.env.JWT_SECRET)
    var user = await axios.get(`${server.url}/api/user/${decoded._id}`)
    var User = {
      name : user.data.name,
      usr_id : user.data.userId,
      prflimg : user.data.prflimg,
    }
    res.render('chapterPost', {title : 'chapter', fmId : req.params.fmId, user: User})
  }
  const pmsg = (req, res) =>{
  const decoded = jwt.verify(req.cookies.indigotoken, process.env.JWT_SECRET)
    axios.post(`${server.url}/api/pmsg`,{
      body : req.body
    }).then((data)=> res.status(201).json(data.data))
  }
  const gmsg = (req, res) => {
    const decoded = jwt.verify(req.cookies.indigotoken, process.env.JWT_SECRET)

    axios.post(`${server.url}/api/gmsg`, {
      from : decoded.userId,
      to : req.body.id   
    }).then(resp =>{
       res.status(200).json(resp.data)

    }).catch(e => console.log(e))
  }
  const updtMsgStats = (req, res) => {
    const decoded = jwt.verify(req.cookies.indigotoken, process.env.JWT_SECRET)
    axios.post(`${server.url}/api/updtMsgStats`, {
       here : decoded.userId,
       there : req.body.there 
    }).then(resp =>{
       res.status(200).json('ok')
    }).catch(e => console.log(e))
  }
const settings = async (req, res) => {
  try{
    const decoded = jwt.verify(req.cookies.indigotoken, process.env.JWT_SECRET)
    var user = await axios.get(`${server.url}/api/user/${decoded._id}`)
    var blocked_users = await axios.post(`${server.url}/api/users2`,{
      usrIds : user.data.settings.blocked_users
    })
  var User = {
    name : user.data.name,
    usr_id : user.data.userId,
    prflimg : user.data.prflimg,
    email : user.data.email,
    blocked_users : blocked_users.data,
    settings : user.data.settings
  }
  res.render('settings', {user : User})           
}catch(err){
  console.log(err)
}
}
const terms_of_use = (req, res)=>{
  res.render('terms_of_use')
}
const privacy = (req, res)=>{
  res.render('privacy')
}
const guide = (req, res)=>{
  res.render('guide')
} 
module.exports = {
  guide, privacy, terms_of_use,settings, fminiFeed, error, fmini, find, drmpost, messages, message, notifications, getChapterPostPage, pmsg, gmsg, updtMsgStats, annexures,replies,alters, nestedReplies, fantoms, fmDl, chapter
  }
