const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('Profile');
const {OAuth2Client} = require('google-auth-library');
const generateUniqueId = require('generate-unique-id')
const signup = (req,res)=>{
    console.log(req.body)
    if(!req.body.name|| !req.body.email || !req.body.password){
        return res.status(400).json({'message':'All fields required'})
    }
    const user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.userId = req.body.userId;
    user.setPassword(req.body.password);
    user.save((err)=>{
        if(err){
            if(err.index == 0 && err.code == 11000){
                console.log(err)
                // return res.status(400).json({"code" : "11000"})
            }
            return res.status(400).json(err)
        }else{
            const token = user.generateJwt();
            res.status(200).json({token})
        }
    })
}

const signin = (req,res)=>{
    if(!req.body.email || !req.body.password){
        return res.status(404).json({'message':'All fields required'})
    }
    passport.authenticate('local',(err,user,info)=>{
        let token;
        if(err){
            return res.status(404).json(err);
        }
        if(user){
            token = user.generateJwt();
             res.status(200).json({token});
        }else{
            res.status(404).json(info)
        }
    })(req,res)
}

const glsignup = (req, res) => {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    async function verify() {
      const ticket = await client.verifyIdToken({
          idToken: req.body.credential,
          audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
          // Or, if multiple clients access the backend:
          //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
      });
      const payload = ticket.getPayload();
      // If request specified a G Suite domain:
      // const domain = payload['hd'];
    const user = new User();
    user.name = payload.name;
    user.email = payload.email;
    user .picture = payload.picture;
    user.userId = generateUniqueId({length : 8})

    user.save((err)=>{
        if(err){
            if(err.index == 0 && err.code == 11000){
                return res.status(400).json({"code" : "11000"})
            }else{
                console.log(err)
            }
        }else{
            const tok = user.generateJwt();
            res.status(200).json(tok);
        }
    })

    }
    verify().catch(console.error);
  }

  const glsignin = (req, res) => {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    async function verify() {
      const ticket = await client.verifyIdToken({
          idToken: req.body.credential,
          audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
          // Or, if multiple clients access the backend:
          //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
      });
      const payload = ticket.getPayload();
      let tok
      User.findOne({email : payload.email},(err, user) =>{
          if(!user){
              return res.status(400).json({"code" : "11001"})
          }else if(err){
              return res.status(400).json(err)
          }
          else if(user){
              tok = user.generateJwt()
               return res.status(200).json(tok)
          }
      })

    }
    verify().catch(console.error);
  }


module.exports = {
    signup, signin, glsignup, glsignin
}
