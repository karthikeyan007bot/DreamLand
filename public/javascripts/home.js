var position;
var refresh_token = '1//048z-zVVUfCYeCgYIARAAGAQSNwF-L9IrawEvrWWsexh5P3dKfpcFEd1WUQHLft3GPodYSNN_l89D4FBYanOX95e4uLYJz23dCw8'
  var serverUrl = 'http://localhost:3000'
// url Async requesting function
function httpGetAsync(theUrl, callback,loadnext, loadTarget)
{
    // create the request object
    var xmlHttp = new XMLHttpRequest();

    // set the state change callback to capture when the response comes in
    xmlHttp.onreadystatechange = function()
    {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        {
            if(loadnext == false){
                callback(xmlHttp.responseText, false,loadTarget);
            }else if(loadnext == true){
            callback(xmlHttp.responseText, true,loadTarget);
            }
        }
    }

    // open as a GET call, pass in the url and set async = True
    xmlHttp.open("GET", theUrl, true);

    // call send with no params as they were passed in on the url string
    xmlHttp.send(null);

    return;
}

// callback for the top 8 GIFs of search
function tenorCallback_search(responsetext, loadnextgif,loadTarget){
    var regxp = /reply-gif-preview-container-[A-Za-z0-9]+/ ;
    var regxp1 = /annex-reply-gif-preview-container-[A-Za-z0-9]+/ ;
    var id = loadTarget.split('r_')[1];
    var target = loadTarget.split('_')[0];
    var gifs = document.getElementsByClassName('preview_gif')
    // Parse the JSON response
    var response_objects = JSON.parse(responsetext);
    top_10_gifs = response_objects["results"];
    position = response_objects['next']
        if(gifs.length == 0){
            top_10_gifs.forEach((e)=>{
            var img = document.createElement('img');
            img.classList.add('preview_gif');
            img.src = e["media_formats"]["nanogif"]["url"];
            img.addEventListener('click', function(event){
              document.getElementById(`${target}_media_preview_${id}`).src = event.target.src
              document.getElementsByClassName('close_img')[0].style.display = 'block'
            })             
            document.getElementById(loadTarget).appendChild(img)
            })
        }else if(gifs.length != 0){
            if(loadnextgif == false){
                [...gifs].forEach(e=>{e.remove()})
                top_10_gifs.forEach((e)=>{
                var img = document.createElement('img');
                img.classList.add('preview_gif');
                img.src = e["media_formats"]["nanogif"]["url"];
                img.addEventListener('click', function(event){
                  document.getElementById(`${target}_media_preview_${id}`).src = event.target.src
                  document.getElementsByClassName('close_img')[0].style.display = 'block'
                })       
                document.getElementById(loadTarget).appendChild(img)            
                })
            }else if(loadnextgif == true){
                top_10_gifs.forEach((e)=>{
                    var img = document.createElement('img');
                    img.classList.add('preview_gif');
                    img.src = e["media_formats"]["nanogif"]["url"];
                    img.addEventListener('click', function(event){
                      document.getElementById(`${target}_media_preview_${id}`).src = event.target.src
                     document.getElementsByClassName('close_img')[0].style.display = 'block'
  })   
                    document.getElementById(loadTarget).appendChild(img)            
                    })
            }

                }
    return;
}


// function to call the trending and category endpoints
function grab_data(term, loadmore, loadTarget)
{
    // set the apikey and limit
    var search_url;
    var apikey = "AIzaSyBR8GXk9ktAR_vplVvdIM7p2sdTYLDyOks";
    var clientkey = "my_test_app";
    // test search term
    var limit = 30
    var search_term = term
    var search_url =  "https://tenor.googleapis.com/v2/search?q=" + search_term + "&key=" +
    apikey +"&client_key=" + clientkey + "&limit=" + limit;

    var loadmore_url = "https://tenor.googleapis.com/v2/search?q=" + search_term + "&key=" +
            apikey +"&client_key=" + clientkey + "&pos=" + position ;
            if(loadmore == true){
                 httpGetAsync(loadmore_url,tenorCallback_search,true,loadTarget);
            }else if(loadmore == false){
               httpGetAsync(search_url,tenorCallback_search, false, loadTarget);
            }


    // data will be loaded by each call's callback
    return;
}

// function to call the featured and category endpoints

function setGifSearch(target, id, num){
  console.log(target)
  console.log( num)
  console.log(id)
    var value = document.getElementById(`tnr_sugsns_${id}_${num}`).innerText
    console.log(value)
    document.getElementById(`${target}_gif_search_${id}`).value = document.getElementById(`tnr_sugsns_${id}_${num}`).innerText
    grab_data(value, false, `${target}_gif_preview_container_${id}`);
  }

// SUPPORT FUNCTIONS ABOVE
// MAIN BELOW
// callback for share event
function tenorCallback_searchSuggestion(responsetext, loadmore, loadTarget)
{ 
    var id = loadTarget.split('search_')[1]
    var target = loadTarget.split('_')[0]
    console.log(loadTarget)
    var response_objects = JSON.parse(responsetext);
    predicted_words = response_objects["results"];
  console.log(target, id)
    var parent_element = document.getElementsByName(`${target}_radio_tile_${id}`)[0]
        while(parent_element.firstChild){
          parent_element.removeChild(parent_element.firstChild)
        }
    for(let n=0; n < predicted_words.length; n++){
      var input_container = document.createElement('div')
      var radio_tile = document.createElement('div')
      var radio_tile_label = document.createElement('div')
      input_container.classList.add('input_container')
      var radio = document.createElement('input')
      var text_node  = document.createTextNode(predicted_words[n])
      radio.type = 'radio'
      radio.classList.add('radio_button')
      radio.name = `tenor_suggestion_${id}`
      radio.id = `${n}_${id}`
      radio.onclick = function (){
        setGifSearch(target, `${id}`, n)
      }
      radio_tile.classList.add('radio_tile')
      radio_tile_label.classList.add('radio_tile_label')
      radio_tile_label.classList.add('label')
      radio_tile_label.htmlFor = `${n}_${id}`
      radio_tile_label.classList.add('tnr_sugsns')
      radio_tile_label.id = `tnr_sugsns_${id}_${n}`
      radio_tile_label.appendChild(text_node)
      radio_tile.appendChild(radio_tile_label)
      input_container.appendChild(radio)
      input_container.appendChild(radio_tile)
      document.getElementsByName(`${target}_radio_tile_${id}`)[0].appendChild(input_container)

    }

}


// SUPPORT FUNCTIONS ABOVE
// MAIN BELOW

//search term


// set the apikey and limit
var apikey = "AIzaSyBR8GXk9ktAR_vplVvdIM7p2sdTYLDyOks";
var clientkey = "my_test_app";
var lmt = 15;

// send search suggestion request
function suggest(target){
  var id = target.id.split('search_')[1]
  if(target.key == 'Enter'){
    grab_data(target.target.value,false,`gif_preview_container_${id}`)
}
  var autoc_url = "https://tenor.googleapis.com/v2/search_suggestions?key=" + apikey + "&client_key=" + clientkey + "&q=" + target.value + "&limit=" + lmt; 
  httpGetAsync(autoc_url,tenorCallback_searchSuggestion, false, target.name);
}

// load more gif
function loadGif(target,id){
    grab_data(document.getElementById(`${target}_gif_search_${id}`).value , true, `${target}_gif_preview_container_${id}`);
}
//search gif
document.getElementById('gfsrch').addEventListener('keyup', (event) => {
    if(event.key == 'Enter'){
        grab_data(event.target.value, false, 'gif-preview-container')
    }
})
// function setgifsearch(){
//     [...document.getElementsByClassName('tnr-sugsns ')].forEach((e)=>{
//             e.addEventListener('click', (event)=>{
//                 document.getElementById('gfsrch').value = event.target.innerText;
//                grab_data(event.target.innerText, false, 'gif-preview-container');
//             })          
//     });
//   }
// load more gif
document.getElementById('reply-load-gif').addEventListener('click', function loadMoreGif(){
    grab_data(document.getElementById('replygfsrch').value , true, 'reply-gif-preview-container');
 })
//search gif


  // load more gif
// document.getElementById('annex-load-gif').addEventListener('click', function loadMoreGif(){
//     grab_data(document.getElementById('annexgfsrch').value , true, 'annex-gif-preview-container');
//  })
// //search gif
// document.getElementById('annexgfsrch').addEventListener('keyup', (event) => {
//     if(event.key == 'Enter'){
//         grab_data(event.target.value,false,'annex-gif-preview-container')
//     }
// })
  // function setannexgifsearch(){
  //   [...document.getElementsByClassName('annex-tnr-sugsns ')].forEach((e)=>{
  //           e.addEventListener('click', (event)=>{
  //               document.getElementById('annexgfsrch').value = event.target.innerText;
  //              grab_data(event.target.innerText, false, 'annex-gif-preview-container');
  //           })          
  //   });
  // }  function setaltergifsearch(){
  //   [...document.getElementsByClassName('alter-tnr-sugsns ')].forEach((e)=>{
  //           e.addEventListener('click', (event)=>{
  //               document.getElementById('altergfsrch').value = event.target.innerText;
  //              grab_data(event.target.innerText, false, 'alter-gif-preview-container');
  //           })          
  //   });
  // }
//   function setReplyReplyGifSearch(target,id){
//             document.getElementById(`replygfsearch${id}`).value = target.innerText;
//            grab_data(target.innerText, false, `reply-gif-preview-container-${id}`);
//   }
//   function setAnnexReplyGifSearch(target,id){
//           document.getElementById(`annexReplygfsearch${id}`).value = target.innerText;
//          grab_data(target.innerText, false, `annex-reply-gif-preview-container-${id}`);
// }
// Fmini post
async function postFmini(id){
    var src
    var gif = document.getElementById(`fmini_media_preview_${id}`).src.search('tenor')
    var image = document.getElementById(`fmini_media_preview_${id}`).src.search('image')
    if(document.getElementById('fantatxtarea').value == ''){
        alert('Ops.... where is fantom?')
    }else{
        document.getElementById('post-spinner').style.display = 'block'
    }
    // if gif
    if(gif != -1 ){
         src = document.getElementById(`fmini_media_preview_${id}`).src
         const data = {
            media : src,
            body : document.getElementById('fantatxtarea').value,
            mood : RadioValueOf('mood'),
            catagory : RadioValueOf('fmini-catagory'),
            tags : tagInputsOf('tags'),
            settings : {
                postAs : RadioValueOf('mode1'),
                whoCanSee : RadioValueOf('mode')
            }
         };
         fetch('http://localhost:3000/fmini', {
            method: 'POST', // or 'PUT'
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          }).then(()=>window.location.href = 'http://localhost:3000/').catch(err => console.log(err))
    }else if(image != -1){ // same for image and video
        var url = document.getElementById(`media_preview_${id}`).src
        var media;
        await fetch(url).then(res => res.blob()).then(blob => media = blob)    

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
                      'mimeType': media.type, // mimeType at Google Drive
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
                    }).then(function(val) {
                        var data = {
                            media : val.id,
                            body : document.getElementById('fantatxtarea').value,
                            mood : document.getElementById('fmmood').innerText,
                            settings : {
                                postAs : RadioValueOf('mode1'),
                                whoCanSee : RadioValueOf('mode')
                            }
                         };
                        fetch('http://localhost:3000/fmini', {
                        method: 'POST',
                        headers: {
                               "Content-Type": "application/json",
                            },
                        body:  JSON.stringify(data)
                          }).then((resp)=>window.location.href = 'http://localhost:3000/').catch(e=> console.log(e))
                   });             
    }else if( gif == -1 && image == -1){
        const data = {
            body : document.getElementById('fantatxtarea').value,
            mood : document.getElementById('fmmood').innerText,
            catagory : RadioValueOf('fmini-catagory'),
            tags : tagInputsOf('tags'),
            settings : {
                postAs : RadioValueOf('mode1'),
                whoCanSee : RadioValueOf('mode')
            }
         };
         fetch('http://localhost:3000/fmini', {
            method: 'POST', // or 'PUT'
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          }).then(()=>window.location.href = 'http://localhost:3000/').catch(err => console.log(err))        
    }
}


function postRxn(fminiId, parentId, usrRefId){
      // var rxn = e.id;
      // var usrRefId =  parseJwt(getCookie('indigotoken'))._id !!! uncomment this line
     axios.post('/api/postRxn',{
      // rxn : rxn,
      usrRefId : usrRefId,
      targetId : fminiId, //fmini or fantom
      parentId : parentId 
     }).then( (resp) =>{
        console.log(resp)
        // window.location.href = '/fminiFeed'
    })
   }


function bottomSheet(id){
        const $ = document.querySelector.bind(document)
      
        const openSheetButton = $(`#open-sheet-${id}`)
        const sheet = $(`#sheet-${id}`)
        const sheetContents = sheet.querySelector(".contents")
        const draggableArea = sheet.querySelector(".draggable-area")
      
        let sheetHeight // in vh
      
        const setSheetHeight = (value) => {
          sheetHeight = Math.max(0, Math.min(100, value))
          sheetContents.style.height = `${sheetHeight}vh`
      
          if (sheetHeight === 100) {
            sheetContents.classList.add("fullscreen")
          } else {
            sheetContents.classList.remove("fullscreen")
          }
        }
      
        const setIsSheetShown = (isShown) => {
          sheet.setAttribute("aria-hidden", String(!isShown))
          if (isShown) {
            document.body.style.overflow = "hidden";
            sheet.addEventListener("touchmove", preventScroll);
          } else {
            document.body.style.overflow = "";
            sheet.removeEventListener("touchmove", preventScroll);
          }
        }
        const preventScroll = (event) => {
          event.preventDefault();
        }
        // Open the sheet when clicking the 'open sheet' button
        // openSheetButton.addEventListener("click", () => {
          if (window.innerWidth < 768) { // only enable sheet on mobile screens
            setSheetHeight(Math.min(50, 720 / window.innerHeight * 100))
            setIsSheetShown(true)
          }
        // })
      
        // Hide the sheet when clicking the 'close' button
        sheet.querySelector(".close-sheet").addEventListener("click", () => {
          setIsSheetShown(false)
        })
      
        // Hide the sheet when clicking the background
        sheet.querySelector(".overlay").addEventListener("click", () => {
          setIsSheetShown(false)
        })
      
        const isFocused = element => document.activeElement === element
      
        // Hide the sheet when pressing Escape if the target element
        // is not an input field
        window.addEventListener("keyup", (event) => {
          const isSheetElementFocused =
            sheet.contains(event.target) && isFocused(event.target)
      
          if (event.key === "Escape" && !isSheetElementFocused) {
            setIsSheetShown(false)
          }
        })
      
        const touchPosition = (event) =>
          event.touches ? event.touches[0] : event
      
        let dragPosition
      
        const onDragStart = (event) => {
          dragPosition = touchPosition(event).pageY
          sheetContents.classList.add("not-selectable")
          draggableArea.style.cursor = document.body.style.cursor = "grabbing"
        }
      
        const onDragMove = (event) => {
          if (dragPosition === undefined) return
      
          const y = touchPosition(event).pageY
          const deltaY = dragPosition - y
          const deltaHeight = deltaY / window.innerHeight * 100
      
          setSheetHeight(sheetHeight + deltaHeight)
          dragPosition = y
        }
      
        const onDragEnd = () => {
          dragPosition = undefined
          sheetContents.classList.remove("not-selectable")
          draggableArea.style.cursor = document.body.style.cursor = ""
      
          if (sheetHeight < 25) {
            setIsSheetShown(false)
          } else if (sheetHeight > 75) {
            setSheetHeight(100)
          } else {
            setSheetHeight(50)
          }
        }

draggableArea.addEventListener("mousedown", onDragStart)
draggableArea.addEventListener("touchstart", onDragStart)

window.addEventListener("mousemove", onDragMove)
window.addEventListener("touchmove", onDragMove)

window.addEventListener("mouseup", onDragEnd)
window.addEventListener("touchend", onDragEnd)
}
function disablePopover(){
  if (window.innerWidth < 768) {
  var popoverElements = document.querySelectorAll('.fmini_options');
  var popovers = [];
  for (var i = 0; i < popoverElements.length; i++) {
    popovers.push(new bootstrap.Popover(popoverElements[i]));
  }
    for (var j = 0; j < popovers.length; j++) {
      popovers[j].disable();
    }
  }
  
    }
    async function recommendUsers(){
      var usr_id = JSON.parse(sessionStorage.getItem('user')).usr_id
      fetch(`${serverUrl}/api/topUsers/${usr_id}`).then(data => data.json()).then( resp => console.log(resp))
   }

   function emoji(){
    document.querySelectorAll('.fmini_reactions').forEach(function (likeBtn) {
      likeBtn.addEventListener('mouseenter', function () {
        document.querySelectorAll('.reaction-icon').forEach(function (reactionIcon, i) {
          setTimeout(function () {
            reactionIcon.classList.add('show');
          }, 100);
        });
      });
      
      likeBtn.addEventListener('mouseleave', function () {
        document.querySelectorAll('.reaction-icon').forEach(function (reactionIcon) {
          reactionIcon.classList.remove('show');
        });
      });
    });
  }