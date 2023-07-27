var popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
var popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))

  var image = document.querySelector("#frontimg");
  document.querySelectorAll('.feedback li').forEach(entry => entry.addEventListener('click', e => {
    console.log('clicked')
    if(!entry.classList.contains('active')) {
        document.querySelector('.feedback li.active').classList.remove('active');
        entry.classList.add('active');
    }
    e.preventDefault();
}));
const serverUrl = 'https://dreamverse.onrender.com'
var refresh_token = '1//04Q-zMWWBOlOfCgYIARAAGAQSNwF-L9Irq7pBmgYwoFp8m4h6vb7hxKHtR1NcJ_jRru1ieBuCVB4YHSlE1Hz9LB-iNhI1hJpxPPI'

function embed(input, id) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    document.getElementsByClassName('close_img')[0].style.display = 'block'
    reader.onload = function (e) {
      document.querySelector(`#media_preview_${id}`).setAttribute("src", e.target.result);
    };

    reader.readAsDataURL(input.files[0]);
  }
}

function readGif(e) {
  document.querySelector("#frontimg").setAttribute("src", e.src);

}

function showlimit(){
  const textareaElem = document.querySelector('#fantatxtarea');
  const counterElem = document.querySelector('.counter');
  const maxLengthCounter = 500;
  let countInput = textareaElem.value.length;
  
  counterElem.innerHTML = `${countInput}/${maxLengthCounter}`;
  
  if (countInput > maxLengthCounter) {
    textareaElem.style.color = 'orangered';
  document.getElementById('postfmini').disabled = true;
    return;
  }
  document.getElementById('postfmini').disabled = false;
  textareaElem.style.color = 'black';
  return;
}
function closeMedia(id){
  var image = document.querySelector(`#media_preview_${id}`);
  if(image.src){
    image.src = ''
    image.display = 'none'
  }
  document.getElementsByClassName('close_img')[0].style.display = 'none'

}

function findPeople(target){
  var user_id = event.target.value
  const cookie = getCookie('indigotoken')
const userIdA = parseJwt(cookie).userId;
var ul = document.getElementById('msgresp')
fetch(`${serverUrl}/api/userByUserId/${user_id}`).then(res => res.json()).then(data =>{
  console.log(data)
  if(document.getElementsByClassName('msgrecep').length != 0){
    document.querySelectorAll('.msgrecep').forEach(el => el.remove())
  }
  [...data.payload].forEach(e=>{ 
    var src;
    if(e.prflimg){
      src = `https://drive.google.com/uc?export=view&id=${e.prflimg}`
    }else{
      src = '/images/user-account-management-logo-user-icon-11562867145a56rus2zwu.png'
    }
  var li = document.createElement('li');
  li.classList.add('list-group-item', 'msgrecep')
  li.style.backgroundColor = 'transparent'
   li.innerHTML = `
   <a href="https://dreamverse.onrender.com/message/${e.name}/${e.userId}?recip=${e.userId}">
       <img src="${src}" alt="" class="msg-to-list-img float-start me-1">
       <div class="msg-accnt-info"></div>
       <strong>${e.name}</strong>
       <br>
       <em>@${e.userId}</em>
   </a>
   `
   ul.appendChild(li)
  })
 })
}
function formatDate(dat) {
  var date = new Date(dat)
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
}
// fantom post
document.getElementById("fmsubmit").addEventListener("click", async function(event){
  var media;
  media = document.getElementById('media_preview_cvrimg').src
  await fetch(media).then(res => res.blob()).then(blob => media = blob)    

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
          var body = {
            title : document.getElementById('drmttl').value,
            desc : document.getElementById('drmdesc').value,
            cover : val.id,
            usrRefId : parseJwt(getCookie('indigotoken'))._id,
            tags : tagInputsOf('ftags'),
            catagory : RadioValueOf('catagory'),
            prota : tagInputsOf('prota'),
            anta : tagInputsOf('anto'),
            deuta : tagInputsOf('deu'),
            tert : tagInputsOf('ter'),
            feelings : checkBoxValueOf('feeling'),
            age_rating : document.getElementById('age_ratings').checked,
            who_can_see: RadioValueOf('who_can_see'),
            post_as: RadioValueOf('post_as'),
            backGround : tagInputsOf('background'),
            // body : editor.getData()
          }
          fetch('/fantomPost',{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
          }).then(async (resp)=>{
            var data = await resp.json()
            console.log(data)
            window.location.href = `/chapter/${data}`
          }).catch((err)=>{
            console.log(err)
          })
       });
});

window.addEventListener("online", function() {
  alert("I am connected to the internet")
})

window.addEventListener("offline", function() {
  alert("Disconnected...so sad!!!")
})
class User{
  constructor(usr_name, usr_id, followers, following){
    this.usr_name = usr_name;
    this.usr_id = usr_id;
    this.followers = followers;
    this.following = following
  }
}
function setUserPic(){
  var prflimg = parseJwt(getCookie('indigotoken')).prflImg;
  document.getElementById('usr_pic').src = `https://drive.google.com/uc?export=view&id=${prflimg}`;
  var user = new User(window.usr_name, window.usr_id)
  window.sessionStorage.setItem('user', JSON.stringify(user))
}
function adjustGridWidth() {
  var grid = document.querySelector('.grid');
  var totalWidth = 0;

  Array.from(grid.children).forEach(function(item) {
    totalWidth += item.offsetWidth;
  });

  grid.style.width = totalWidth + 'px';
}
async function follow(userId){
  var userB = parseJwt(getCookie('indigotoken'))._id
    var body = {
      following : userId,
      follower : userB
    }  
  fetch(`${serverUrl}/api/follow`,{
    method : 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)    
  }).then( data => alert('Done'))
}
window.addEventListener('DOMContentLoaded', adjustGridWidth);
window.addEventListener('resize', adjustGridWidth);