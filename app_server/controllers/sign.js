var express = require('express');
var app = express();
const axios = require('axios');
const {CourierClient} = require('@trycourier/courier')
const jwt = require('jsonwebtoken')
const apiOptions = {
    server:'https://dreamverse.vercel.app/'
};
function AddDays (days) {
    var today = new Date();
    var resultDate = new Date(today);
    resultDate.setDate(today.getDate()+days);
    return resultDate;
}
const signin = (req, res) => {
    res.render('signin',{title : `signin`, error: req.query.msg})
  }
  const signup = (req, res) => {
    res.render('signup',{title : `signup`,  error: req.query.msg})
  }
  const signupp2 = (req, res) => {
    var decoded = jwt.verify(req.params.emailtoken, process.env.JWT_SECRET)
    console.log(decoded)
    res.render('signup2', {name : decoded.name, email : decoded.email})

  }
  const signupp3 = (req, res) => {
    console.log('signup3', req.params,req.body)
          axios.post(`${apiOptions.server}/api/signup`,{
            name : req.params.name,
            email : req.params.email,
            userId : req.body.userId,
            password : req.body.password
        }).then((response) =>{
        res.cookie('indigotoken', response.data.token, {expire: AddDays(7).toGMTString(),  overwrite: true});
            res.redirect(`/profile`)
        }).catch((err) =>{ 
            console.log(err)
            if(err.response.data.code == '11000'){
            res.redirect('/signin?msg=try_login')
        }
    }
        )  
  }
  const signupp = async (req, res) => {
    const regxp =/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
    if(regxp.test(req.body.credential)){
    axios.post(`${apiOptions.server}/api/glsignup`,{
        credential : req.body.credential
    }).then(function(response){
        res.cookie('indigotoken', response.data, {expire: AddDays(7).toGMTString(),  overwrite: true});
        //  res.setHeader('set-cookie', `indigotoken = ${response.data}; expires= ${AddDays(7).toGMTString()}}`);
          res.redirect(`/`)
    }
    ).catch((err) => {
        if(err.response){
            if(err.response.data.code){
                if(err.response.data.code == '11000'){
                    res.redirect('/signin?msg=try_login')
                }else{
                    console.log(err.response.data.code)
                }
                  }
        }else{
            console.log(err)
        }

    })
    }
    else {    
        axios.post(`${apiOptions.server}/api/checkMail`,{
            email : req.body.email
        }).then(async (resp) => {
            if(resp.data.code == 1){ // checks for existing email
                res.redirect('/signin?msg=try_login') // if exists redirect to login page
            }else if(resp.data.code == 0){ // if not sends verification email to client
                const courier = CourierClient({ authorizationToken: "pk_test_BXDFB0NFM14WYSG1TWYT4SE3J3BE" });
                const token = jwt.sign({
                    email : req.body.email,
                    name : req.body.name
                }, process.env.JWT_SECRET) 
                const { requestId } = await courier.send({
                  message: {
                    to: {
                        "email" : req.body.email
                  },
                    template: "ETADZ6MQJRMK6NGP3JC53XD2DZ2G",
                    data: {
                      variables: "awesomeness",
                      name : req.body.name,
                      page : `${apiOptions.server}/signup2/${token}`
                    },
                  },
                });
                res.render('info', {message : 'We have sent you verification mail. Please proceed with that.' })
            }
        }).catch(err => console.log(err))
    } 
    }

    const signinp = app.post('/signin', (req, res) => {
        const regxp =/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;
        if( regxp.test(req.body.credential)){
            axios.post(`${apiOptions.server}/api/glsignin`,{
                credential : req.body.credential
            }).then((response)=>{
                res.setHeader('set-cookie', `indigotoken = ${response.data}; expires= ${AddDays(7).toGMTString()}`);
                res.redirect(`/`)
            }).catch((err)=>{
                if(err.response.data.code == 11001){
                    res.redirect('/signup?msg=try_signup')
                }
            })
        }
           else{ 
            axios.post(`${apiOptions.server}/api/signin`,{
                email : req.body.email,
                password : req.body.password
            }).then((response) => {
                res.setHeader('set-cookie', `indigotoken = ${response.data.token}; expires= ${AddDays(7).toGMTString()}`);
                res.redirect(`/`)
            }).catch(err =>{
                console.log(err)
                if(err.response.data.message == 'Incorrect UserName'){
                    res.redirect('/signin?msg=IU')
                }else  if(err.response.data.message == 'Incorrect Password'){
                    res.redirect('/signin?msg=IP')
                }
            }
            )}
    
    })
  module.exports =  {
    signin, signup, signupp, signinp, signupp2, signupp3
  }