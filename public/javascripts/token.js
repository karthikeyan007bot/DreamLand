
function getCookie(name) {
   const value = `; ${document.cookie}`;
   const parts = value.split(`; ${name}=`);
   if (parts.length === 2) return parts.pop().split(';').shift();
 }
const jwt_token = getCookie('indigotoken')

function setToken(token){
let presetToken = window.localStorage.getItem('indigotoken');
if(token == undefined || null){
   console.log('undef')
}else if(presetToken){
      window.localStorage.removeItem('indigotoken')
      window.localStorage.setItem('indigotoken', token)
}else{
      window.localStorage.setItem('indigotoken', token)
}
//  if(presetToken){
//    if(presetToken == undefined  || null){
//       console.log('undef')
//    }else{
//       window.localStorage.removeItem('indigotoken')
//       window.localStorage.setItem('indigotoken', token)
//    }

//  }else if(!presetToken){
//     window.localStorage.setItem('indigotoken', token)
//  }else if(token == undefined  || null){
//    console.log('undef')
// }
}

function isLoggedIn(){
const token = window.localStorage.getItem('indigotoken')
const regxp =/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;
if( regxp.test(token)){
   const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp >( Date.now() / 1000);
    }else{
      return false;
    }
}
function getUser(){
const token = window.localStorage.getItem('indigotoken')
const regxp =/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;
if( regxp.test(token)){
   const { email, name } = JSON.parse(atob(token.split('.')[1]));
   return {email, name}
 } else{
   const email = 'user@gmail.com'
   return email
 } 
}
function setUser(){     

const token = window.localStorage.getItem('indigotoken')
const mbr_feature = document.getElementsByClassName('mbr-feature')
const gst_feature = document.getElementsByClassName('gst-feature')
let r = getUser().email
const name = getUser().name
let t = document.querySelector('#usrimg')

 if(token){
  if(isLoggedIn()){
   for(let i=0;i<mbr_feature.length ; i++){
      mbr_feature[i].style.display = 'block'
   }
   for(let i=0;i<gst_feature.length ; i++){
      gst_feature[i].style.display = 'none'
   }
  if(r !== undefined || null){
   t.setAttribute('data-email', r)
  }
  }else if(!isLoggedIn()){
      for(let i=0;i<mbr_feature.length ; i++){
         mbr_feature[i].style.display = 'none'
      }
      for(let i=0;i<gst_feature.length ; i++){
         gst_feature[i].style.display = 'block'
      }  
  }
 }else{
   for(let i=0;i<mbr_feature.length ; i++){
      mbr_feature[i].style.display = 'none'
   }
   for(let i=0;i<gst_feature.length ; i++){
      gst_feature[i].style.display = 'block'
   }      
 }
}
function logOut(){
   window.localStorage.removeItem('indigotoken')
}
setToken(jwt_token)

