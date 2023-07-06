var express = require('express');
const router = express.Router()
const axios = require('axios')
const fileUpload = require('express-fileupload');
const jwt = require('jsonwebtoken')
const server= {
  url:'http://localhost:3000'
};
const {google} = require('googleapis')
const oauth2Client = new google.auth.OAuth2(
  '107645595769-al5lco2dmqo4k8da50skhh04v3reub4r.apps.googleusercontent.com',
  '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',
'https://developers.google.com/oauthplayground'
)
oauth2Client.setCredentials({refresh_token : '1//04XqJlix_lvj3CgYIARAAGAQSNwF-L9Irlgt5jNxMaJVZWyONfMZwncgbimOu2dcXRhViD4nhtruhCh7nlv0mA66WdNMo7gFjFc4'})

var drive = google.drive({
 version : 'v3',
 auth : oauth2Client
})
const fmini = (req, res) => {
  const decoded = jwt.verify(req.cookies.indigotoken, process.env.JWT_SECRET)
  axios.post(`${server.url}/api/fmini`,{
      refId : decoded._id,
       media : req.body.media,
       body : req.body.body,
       mood : req.body.mood,
       settings : req.body.settings,
       tags : req.body.tags,
       catagory : req.body.catagory,
       userId : decoded.userId,
       userName : decoded.name
  }).then((resp)=> {
       res.status(201).json('ok')
  }).catch(err => console.log(err))
};
const chapterPost = (req, res) => {
  axios.post(`${server.url}/api/chapter/${req.params.fmId}`,{
    title : req.body.title ,
    chapter : req.body.chapter
  }).then(()=> res.redirect('/fminiFeed')).catch(err => console.log(err))
}
const fantomPost = async (req, res) =>{
  const decoded = jwt.verify(req.cookies.indigotoken, process.env.JWT_SECRET)
  var fileId = req.body.cover
  await drive.permissions.create({
    fileId : fileId,
    requestBody : {
      role : 'reader',
      type : 'anyone'
    }
  }).then(()=> console.log('permission granted to all'))
  axios.post(`${server.url}/api/fantom`,{
      userId : decoded.userId,
      userName : decoded.name,
       title : req.body.title,
       desc : req.body.desc,
       tags : req.body.tags,
       catagory : req.body.catagory,
       prota : req.body.prota,
       anta : req.body.anta,
       deuta : req.body.deuta,
       tert : req.body.tert,
       feelings : req.body.feelings,
       age_rating : req.body.age_rating,
       who_can_see : req.body.who_can_see,
       post_as : req.body.post_as,
       backGround : req.body.backGround,
       cover : req.body.cover,
       usrRefId : req.body.usrRefId
  }).then((resp)=> {
    res.status(201).json(resp.data)
  }).catch(err => console.log(err))
}
 const postRxn = (req, res) => {
  console.log(req.body)
 }
module.exports = {
  fmini, fantomPost, postRxn, chapterPost
}