const mongoose  = require('mongoose');
const Profile = mongoose.model('Profile')

const checkMail = (req, res) => {
    Profile.findOne({email : req.body.email}).exec((err, user) => {
        if(err){
            console.log(err)
        }else if(user){
            res.status(200).json({"code" : 1})
        }else{
            res.status(200).json({"code" : 0})
        }
    })
}
const getProfile = (req, res)  => {
    Profile.findById(req.query.id).exec((err, user) => {
        if(err){
            console.log(err)
        }else{
             res.status(200).json(user)
        }
        
    })
    return res
}
const hdrimg = (req, res) =>{
    Profile.findById(req.body._id).exec((err,user)=>{
        if(err){
            console.log(err)
        }else{
       user.hdrimg = req.body.hdrimg
        }
        user.save((err, usered)=>{
            if(err){
                console.log(err)
            }else{
                return res.status(201).json('ok')
            }
        })
})
  return res
}
const prflimg = (req, res) =>{
    Profile.findById(req.body._id).exec((err,user)=>{
        if(err){
            console.log(err)
        }else{
       user.prflimg = req.body.prflimg
        }
        user.save((err, usered)=>{
            if(err){
                console.log(err)
            }else{
                return res.status(201).json('ok')
            }
        })
})
  return res
}
const pstbasicprflinfo = (req, res) => {
    Profile.findById(req.body._id).exec((err,user)=>{
        if(err){
            console.log(err)
        }else{
            if( req.body.name !=''){
                user.name = req.body.name
            }
            if(req.body.about !=''){
                user.about = req.body.about
            }
            if(req.body.fbuserid !=''){
                user.fbuserid = req.body.fbuserid
            }
            if(req.body.twtruserid !=''){
                user.twtruserid = req.body.twtruserid
            }
            if(req.body.instauserid !=''){
                user.instauserid = req.body.instauserid
            }          
        }
        user.save((err, usered)=>{
            if(err){
                console.log(err)
            }else{
                const token = user.generateJwt()
                return res.status(201).json(token)
            }
        })
    })
}

module.exports = {
    pstbasicprflinfo, hdrimg, getProfile, prflimg, checkMail
}