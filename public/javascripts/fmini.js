var refresh_token = '1//04Q-zMWWBOlOfCgYIARAAGAQSNwF-L9Irq7pBmgYwoFp8m4h6vb7hxKHtR1NcJ_jRru1ieBuCVB4YHSlE1Hz9LB-iNhI1hJpxPPI'


async function postToTarget(toId, target,to){
  var body, media ;
   var refId =  parseJwt(getCookie('indigotoken'))._id;
   var toId = toId ;
   const spinner = document.getElementById(`${target}_spinner`)
   spinner.style.display = 'block'
   media = document.getElementById(`${target}_media_preview_${toId}`).src
   body = document.getElementById(`${target}_${toId}`).value
   if(media.includes('tenor')){
     media = media
   }else if(media.includes('png' || 'png')){
     await fetch(url).then(res => res.blob()).then(blob => media = blob) ;
           // access token request
let tokenRequest = await axios.request({
method: 'post',
url: "https://oauth2.googleapis.com/token",
headers: {"content-type": "application/x-www-form-urlencoded"},
params: {
client_id: '107645595769-al5lco2dmqo4k8da50skhh04v3reub4r.apps.googleusercontent.com',
client_secret: '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',
refresh_token: refresh_token,
grant_type: "refresh_token"
} 
}).catch(e => console.log(e))

let accessToken = tokenRequest.data["access_token"];
console.log('Access token : ' +   accessToken )

var metadata = {
'name': 'sampleName', // Filename at Google Drive
'mimeType': 'image/png', // mimeType at Google Drive
};
// var accessToken = gapi.auth.getToken().access_token; // Here gapi is used for retrieving the access token.
var form = new FormData();
form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
form.append('file', media);

fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
method: 'POST',
headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
body: form,
}).then((res) => {
return res.json();
}).then(async function(val) {
var filedId = val.id
await drive.permissions.create({
  filedId : filedId,
  requestBody : {
    role : 'reader',
    type : 'anyone'
  }
}).then(console.log('permission granted for everyone'))
media = val.id

});
   }else{
     media = undefined
   }
       await axios.post(`/api/postToTarget`,{ 
target : target, // reply or annex or alter
body : body ,
toId : toId, // fmini or fantom
usrRefId : refId,
media : media,
to : to
}).then( resp => window.location.href = 'https://dreamverse.onrender.com') 
}
 async function postCommonReply(id,fminiRefId){
  // var reply_to_reply, reply_to_annex= false;
  // var regxp1 = /annex-[A-Za-z0-9]+/ ; 
  var media=undefined
  var refId =  parseJwt(getCookie('indigotoken'))._id // user reference id
   media = document.getElementById(`reply_media_preview_${id}`).src
  var reply = document.getElementById(`reply_${id}`).value;

  if(media.includes('https://media.tenor.com')){
        media = media
    }else if (media.includes('png' || 'jpg')){
      await fetch(url).then(res => res.blob()).then(blob => media = blob)    
    
      // access token request
      let tokenRequest = await axios.request({
        method: 'post',
        url: "https://oauth2.googleapis.com/token",
        headers: {"content-type": "application/x-www-form-urlencoded"},
        params: {
        client_id: '107645595769-al5lco2dmqo4k8da50skhh04v3reub4r.apps.googleusercontent.com',
        client_secret: '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',
        refresh_token: refresh_token,
        grant_type: "refresh_token"
            } 
          }).catch(e => console.log(e))
          
          let accessToken = tokenRequest.data["access_token"];
    
         var metadata = {
          'name': 'sampleName', // Filename at Google Drive
          'mimeType': 'image/png', // mimeType at Google Drive
            };
        // var accessToken = gapi.auth.getToken().access_token; // Here gapi is used for retrieving the access token.
       var form = new FormData();
       form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
       form.append('file', media);
    
       fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
      method: 'POST',
      headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
      body: form,
        }).then((res) => {
      return res.json();
        }).then(async function(val) {
          var filedId = val.id
          await drive.permissions.create({
            filedId : filedId,
            requestBody : {
              role : 'reader',
              type : 'anyone'
            }
          }).then(console.log('permission granted for everyone'))         
          media = val.id
       });
    }
    axios.post('https://dreamverse.onrender.com/postCommonReply',{
      reply : reply,
      parentId : id,
      refId : refId,
      fminiRefId : fminiRefId, 
      media : media
     }).then( resp => window.location.href = 'https://dreamverse.onrender.com') 
 }


