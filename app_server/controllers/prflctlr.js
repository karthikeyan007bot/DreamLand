var express = require('express');
const app = express()
const router = express.Router()
const jwt = require('jsonwebtoken')
const axios = require('axios');
const { google } = require('googleapis');
const { Readable } = require('stream');
const multer  = require('multer')
const fileUpload = require('express-fileupload');
var server= {}
server.url = process.env.serverURL
  class user{
    constructor(name, id, following, followers, prflimg){
      this.name  = name;
      this.id = id ;
      this.following = following ;
      this.followers = followers ;
      this.prflimg = prflimg
    }
    }
    function AddDays (days) {
      var today = new Date();
      var resultDate = new Date(today);
      resultDate.setDate(today.getDate()+days);
      return resultDate;
  }
const prflinfo = (req, res) =>{
    const decoded = jwt.verify(req.cookies.indigotoken, process.env.JWT_SECRET)
    axios.post(`${server.url}/api/profile`,{
        _id : decoded._id,
        name : req.body.name,
        about : req.body.about,
        fbuserid : req.body.fbuserid,
        instauserid : req.body.instauserid,
        twtruserid : req.body.twtruserid,
    }).then((resp)=> {
      const expirationDate = AddDays(7);
      console.log(resp.data)
        res.cookie('indigotoken', resp.data, {expires: expirationDate,  overwrite: true});
        res.redirect('/profile')
    }).catch(err => console.log(err))
};

const hdrimg =(req, res) =>{
    const decoded = jwt.verify(req.cookies.indigotoken, process.env.JWT_SECRET)
    axios.post(`${server.url}/api/hdrimg`,{
        _id : decoded._id,
        hdrimg : req.body.id,
    }).then((resp)=> {
         res.status(201).json('saved')
    }).catch(err => console.log(err))

};
const prflimg =(req, res) =>{
    const decoded = jwt.verify(req.cookies.indigotoken, process.env.JWT_SECRET)
    axios.post(`${server.url}/api/prflimg`,{
        _id : decoded._id,
        prflimg : req.body.id,
    }).then((resp)=> {
         res.status(201).json('saved')
    }).catch(err => console.log(err))

};
const profile = async (req, res) => { 
    if(req.cookies.indigotoken){
      const decoded = jwt.verify(req.cookies.indigotoken, process.env.JWT_SECRET)
      const usr_replies = await axios.get(`${server.url}/api/replies/${decoded._id}`)
      const usr_annexes = await axios.get(`${server.url}/api/annexes/${decoded._id}`)
      const usr_alters = await axios.get(`${server.url}/api/alters/${decoded._id}`)
      const usr_fminis = await axios.get(`${server.url}/api/fminis/detail/${decoded._id}`)
      const usr_fantoms = await axios.get(`${server.url}/api/fantoms/detail/${decoded._id}`)
      axios.get(`${server.url}/api/user/${decoded._id}`).then( resp => { // gets information about user
            var User = {
                name : resp.data.name,
                id : resp.data.userId,
                following : resp.data.following,
                followers : resp.data.followers,
                prflimg : resp.data.prflimg,
                about : resp.data.about,
                joinedat : resp.data.joinedat,
                fbuserid : resp.data.fbuserid,
                twtruserid : resp.data.twtruserid,
                instauserid : resp.data.instauserid
            }
        res.render('profile', {
          title : 'Profile',
          user : User,
          usr_replies : usr_replies.data,
          usr_annexes : usr_annexes.data,
          usr_alters : usr_alters.data,
          usr_fminis : usr_fminis.data,
          usr_fantoms : usr_fantoms.data,
         })
      }).catch(err => console.log(err))
    }else{
      res.render('signin')
    }

  }
  const user_profile = async (req, res) => { 
      const userId  = req.params.userId
      const decoded = jwt.verify(req.cookies.indigotoken, process.env.JWT_SECRET)
      const usr_replies = await axios.get(`${server.url}/api/replies/${userId}`)
      const usr_annexes = await axios.get(`${server.url}/api/annexes/${userId}`)
      const usr_alters = await axios.get(`${server.url}/api/alters/${userId}`)
      const usr_fminis = await axios.get(`${server.url}/api/fminis/detail/${userId}`)
      const usr_fantoms = await axios.get(`${server.url}/api/fantoms/detail/${userId}`)
      var user = await axios.get(`${server.url}/api/user/${userId}`)
      var profile_user = {
        name : user.data.name,
        userId : user.data.userId,
        _id : user.data._id,
        following : user.data.following,
        followers : user.data.followers,
        prflimg : user.data.prflimg,
        about : user.data.about,
        joinedat : user.data.joinedat,
        fbuserid : user.data.fbuserid,
        twtruserid : user.data.twtruserid,
        instauserid : user.data.instauserid
    }
      // const usr_likes = await axios.get(`${server.url}/api/likes/detail/${userId}`)
       axios.get(`${server.url}/api/user/${decoded._id}`).then( resp => { // gets information about user
            var User = {
                name : resp.data.name,
                id : resp.data.userId,
                following : resp.data.following,
                followers : resp.data.followers,
                prflimg : resp.data.prflimg,
                about : resp.data.about,
                joinedat : resp.data.joinedat,
                fbuserid : resp.data.fbuserid,
                twtruserid : resp.data.twtruserid,
                instauserid : resp.data.instauserid
            }
        res.render('user_profile', {
          title : 'Profile',
          user : User,
          profile_user : profile_user,
          usr_replies : usr_replies.data,
          usr_annexes : usr_annexes.data,
          usr_alters : usr_alters.data,
          usr_fminis : usr_fminis.data,
          usr_fantoms : usr_fantoms.data,
         })
      }).catch(err => console.log(err))
  }
module.exports = {
    prflinfo, hdrimg, prflimg, profile, user_profile
}