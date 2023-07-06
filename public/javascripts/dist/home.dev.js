"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var position;
var refresh_token = '1//048z-zVVUfCYeCgYIARAAGAQSNwF-L9IrawEvrWWsexh5P3dKfpcFEd1WUQHLft3GPodYSNN_l89D4FBYanOX95e4uLYJz23dCw8';
var serverUrl = 'http://localhost:3000'; // url Async requesting function

function httpGetAsync(theUrl, callback, loadnext, loadTarget) {
  // create the request object
  var xmlHttp = new XMLHttpRequest(); // set the state change callback to capture when the response comes in

  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      if (loadnext == false) {
        callback(xmlHttp.responseText, false, loadTarget);
      } else if (loadnext == true) {
        callback(xmlHttp.responseText, true, loadTarget);
      }
    }
  }; // open as a GET call, pass in the url and set async = True


  xmlHttp.open("GET", theUrl, true); // call send with no params as they were passed in on the url string

  xmlHttp.send(null);
  return;
} // callback for the top 8 GIFs of search


function tenorCallback_search(responsetext, loadnextgif, loadTarget) {
  console.log(responsetext, loadnextgif, loadTarget);
  var regxp = /reply-gif-preview-container-[A-Za-z0-9]+/;
  var regxp1 = /annex-reply-gif-preview-container-[A-Za-z0-9]+/;
  var id = loadTarget.split('r_')[1];
  var target = loadTarget.split('_')[0];
  var gifs = document.getElementsByClassName('preview_gif'); // Parse the JSON response

  var response_objects = JSON.parse(responsetext);
  top_10_gifs = response_objects["results"];
  position = response_objects['next'];

  if (gifs.length == 0) {
    top_10_gifs.forEach(function (e) {
      var img = document.createElement('img');
      img.classList.add('preview_gif');
      img.src = e["media_formats"]["nanogif"]["url"];
      img.addEventListener('click', function (event) {
        document.getElementById("".concat(target, "_media_preview_").concat(id)).src = event.target.src;
        document.getElementsByClassName('close_img')[0].style.display = 'block';
      });
      document.getElementById(loadTarget).appendChild(img);
    });
  } else if (gifs.length != 0) {
    if (loadnextgif == false) {
      _toConsumableArray(gifs).forEach(function (e) {
        e.remove();
      });

      top_10_gifs.forEach(function (e) {
        var img = document.createElement('img');
        img.classList.add('preview_gif');
        img.src = e["media_formats"]["nanogif"]["url"];
        img.addEventListener('click', function (event) {
          document.getElementById("".concat(target, "_media_preview_").concat(id)).src = event.target.src;
          document.getElementsByClassName('close_img')[0].style.display = 'block';
        });
        document.getElementById(loadTarget).appendChild(img);
      });
    } else if (loadnextgif == true) {
      top_10_gifs.forEach(function (e) {
        var img = document.createElement('img');
        img.classList.add('preview_gif');
        img.src = e["media_formats"]["nanogif"]["url"];
        img.addEventListener('click', function (event) {
          document.getElementById("".concat(target, "_media_preview_").concat(id)).src = event.target.src;
          document.getElementsByClassName('close_img')[0].style.display = 'block';
        });
        document.getElementById(loadTarget).appendChild(img);
      });
    }
  }

  return;
} // function to call the trending and category endpoints


function grab_data(term, loadmore, loadTarget) {
  // set the apikey and limit
  var search_url;
  var apikey = "AIzaSyBR8GXk9ktAR_vplVvdIM7p2sdTYLDyOks";
  var clientkey = "my_test_app"; // test search term

  var limit = 30;
  var search_term = term;
  var search_url = "https://tenor.googleapis.com/v2/search?q=" + search_term + "&key=" + apikey + "&client_key=" + clientkey + "&limit=" + limit;
  var loadmore_url = "https://tenor.googleapis.com/v2/search?q=" + search_term + "&key=" + apikey + "&client_key=" + clientkey + "&pos=" + position;

  if (loadmore == true) {
    httpGetAsync(loadmore_url, tenorCallback_search, true, loadTarget);
  } else if (loadmore == false) {
    httpGetAsync(search_url, tenorCallback_search, false, loadTarget);
  } // data will be loaded by each call's callback


  return;
} // function to call the featured and category endpoints


function setGifSearch(target, id, num) {
  console.log(target);
  console.log(num);
  console.log(id);
  var value = document.getElementById("tnr_sugsns_".concat(id, "_").concat(num)).innerText;
  console.log(value);
  document.getElementById("".concat(target, "_gif_search_").concat(id)).value = document.getElementById("tnr_sugsns_".concat(id, "_").concat(num)).innerText;
  grab_data(value, false, "".concat(target, "_gif_preview_container_").concat(id));
} // SUPPORT FUNCTIONS ABOVE
// MAIN BELOW
// callback for share event


function tenorCallback_searchSuggestion(responsetext, loadmore, loadTarget) {
  var id = loadTarget.split('search_')[1];
  var target = loadTarget.split('_')[0];
  console.log(loadTarget);
  var response_objects = JSON.parse(responsetext);
  predicted_words = response_objects["results"];
  console.log(target, id);
  var parent_element = document.getElementsByName("".concat(target, "_radio_tile_").concat(id))[0];

  while (parent_element.firstChild) {
    parent_element.removeChild(parent_element.firstChild);
  }

  var _loop = function _loop(n) {
    input_container = document.createElement('div');
    radio_tile = document.createElement('div');
    radio_tile_label = document.createElement('div');
    input_container.classList.add('input_container');
    radio = document.createElement('input');
    text_node = document.createTextNode(predicted_words[n]);
    radio.type = 'radio';
    radio.classList.add('radio_button');
    radio.name = "tenor_suggestion_".concat(id);
    radio.id = "".concat(n, "_").concat(id);

    radio.onclick = function () {
      setGifSearch(target, "".concat(id), n);
    };

    radio_tile.classList.add('radio_tile');
    radio_tile_label.classList.add('radio_tile_label');
    radio_tile_label.classList.add('label');
    radio_tile_label.htmlFor = "".concat(n, "_").concat(id);
    radio_tile_label.classList.add('tnr_sugsns');
    radio_tile_label.id = "tnr_sugsns_".concat(id, "_").concat(n);
    radio_tile_label.appendChild(text_node);
    radio_tile.appendChild(radio_tile_label);
    input_container.appendChild(radio);
    input_container.appendChild(radio_tile);
    document.getElementsByName("".concat(target, "_radio_tile_").concat(id))[0].appendChild(input_container);
  };

  for (var n = 0; n < predicted_words.length; n++) {
    var input_container;
    var radio_tile;
    var radio_tile_label;
    var radio;
    var text_node;

    _loop(n);
  }
} // SUPPORT FUNCTIONS ABOVE
// MAIN BELOW
//search term
// set the apikey and limit


var apikey = "AIzaSyBR8GXk9ktAR_vplVvdIM7p2sdTYLDyOks";
var clientkey = "my_test_app";
var lmt = 15; // send search suggestion request

function suggest(target) {
  var id = target.id.split('search_')[1];

  if (target.key == 'Enter') {
    grab_data(target.target.value, false, "gif_preview_container_".concat(id));
  }

  var autoc_url = "https://tenor.googleapis.com/v2/search_suggestions?key=" + apikey + "&client_key=" + clientkey + "&q=" + target.value + "&limit=" + lmt;
  httpGetAsync(autoc_url, tenorCallback_searchSuggestion, false, target.name);
} // load more gif


function loadGif(target, id) {
  grab_data(document.getElementById("".concat(target, "_gif_search_").concat(id)).value, true, "".concat(target, "_gif_preview_container_").concat(id));
} //search gif


document.getElementById('gfsrch').addEventListener('keyup', function (event) {
  if (event.key == 'Enter') {
    grab_data(event.target.value, false, 'gif-preview-container');
  }
}); // function setgifsearch(){
//     [...document.getElementsByClassName('tnr-sugsns ')].forEach((e)=>{
//             e.addEventListener('click', (event)=>{
//                 document.getElementById('gfsrch').value = event.target.innerText;
//                grab_data(event.target.innerText, false, 'gif-preview-container');
//             })          
//     });
//   }
// load more gif

document.getElementById('reply-load-gif').addEventListener('click', function loadMoreGif() {
  grab_data(document.getElementById('replygfsrch').value, true, 'reply-gif-preview-container');
}); //search gif
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

function postFmini(id) {
  var src, gif, image, data, url, media, tokenRequest, accessToken, metadata, form, _data;

  return regeneratorRuntime.async(function postFmini$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          gif = document.getElementById("fmini_media_preview_".concat(id)).src.search('tenor');
          image = document.getElementById("fmini_media_preview_".concat(id)).src.search('image');

          if (document.getElementById('fantatxtarea').value == '') {
            alert('Ops.... where is fantom?');
          } else {
            document.getElementById('post-spinner').style.display = 'block';
          } // if gif


          if (!(gif != -1)) {
            _context.next = 9;
            break;
          }

          src = document.getElementById("fmini_media_preview_".concat(id)).src;
          data = {
            media: src,
            body: document.getElementById('fantatxtarea').value,
            mood: RadioValueOf('mood'),
            catagory: RadioValueOf('fmini-catagory'),
            tags: tagInputsOf('tags'),
            settings: {
              postAs: RadioValueOf('mode1'),
              whoCanSee: RadioValueOf('mode')
            }
          };
          fetch('http://localhost:3000/fmini', {
            method: 'POST',
            // or 'PUT'
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          }).then(function () {
            return window.location.href = 'http://localhost:3000/';
          })["catch"](function (err) {
            return console.log(err);
          });
          _context.next = 25;
          break;

        case 9:
          if (!(image != -1)) {
            _context.next = 24;
            break;
          }

          // same for image and video
          url = document.getElementById("media_preview_".concat(id)).src;
          _context.next = 13;
          return regeneratorRuntime.awrap(fetch(url).then(function (res) {
            return res.blob();
          }).then(function (blob) {
            return media = blob;
          }));

        case 13:
          _context.next = 15;
          return regeneratorRuntime.awrap(axios.request({
            method: 'post',
            url: "https://oauth2.googleapis.com/token",
            headers: {
              "content-type": "application/x-www-form-urlencoded"
            },
            params: {
              client_id: '107645595769-al5lco2dmqo4k8da50skhh04v3reub4r.apps.googleusercontent.com',
              client_secret: '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',
              refresh_token: refresh_token,
              grant_type: "refresh_token"
            }
          })["catch"](function (e) {
            return console.log(e);
          }));

        case 15:
          tokenRequest = _context.sent;
          accessToken = tokenRequest.data["access_token"];
          metadata = {
            'name': 'sampleName',
            // Filename at Google Drive
            'mimeType': media.type // mimeType at Google Drive

          }; // var accessToken = gapi.auth.getToken().access_token; // Here gapi is used for retrieving the access token.

          form = new FormData();
          form.append('metadata', new Blob([JSON.stringify(metadata)], {
            type: 'application/json'
          }));
          form.append('file', media);
          fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
            method: 'POST',
            headers: new Headers({
              'Authorization': 'Bearer ' + accessToken
            }),
            body: form
          }).then(function (res) {
            return res.json();
          }).then(function (val) {
            var data = {
              media: val.id,
              body: document.getElementById('fantatxtarea').value,
              mood: document.getElementById('fmmood').innerText,
              settings: {
                postAs: RadioValueOf('mode1'),
                whoCanSee: RadioValueOf('mode')
              }
            };
            fetch('http://localhost:3000/fmini', {
              method: 'POST',
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(data)
            }).then(function (resp) {
              return window.location.href = 'http://localhost:3000/';
            })["catch"](function (e) {
              return console.log(e);
            });
          });
          _context.next = 25;
          break;

        case 24:
          if (gif == -1 && image == -1) {
            _data = {
              body: document.getElementById('fantatxtarea').value,
              mood: document.getElementById('fmmood').innerText,
              catagory: RadioValueOf('fmini-catagory'),
              tags: tagInputsOf('tags'),
              settings: {
                postAs: RadioValueOf('mode1'),
                whoCanSee: RadioValueOf('mode')
              }
            };
            fetch('http://localhost:3000/fmini', {
              method: 'POST',
              // or 'PUT'
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(_data)
            }).then(function () {
              return window.location.href = 'http://localhost:3000/';
            })["catch"](function (err) {
              return console.log(err);
            });
          }

        case 25:
        case "end":
          return _context.stop();
      }
    }
  });
}

function postRxn(e, fminiId, parentId) {
  var rxn = e.id;

  var usrRefId = parseJwt(getCookie('indigotoken'))._id;

  axios.post('/api/postRxn', {
    rxn: rxn,
    usrRefId: usrRefId,
    fminiId: fminiId,
    parentId: parentId
  }).then(function (resp) {
    console.log(resp); // window.location.href = '/fminiFeed'
  });
}

function bottomSheet(id) {
  var $ = document.querySelector.bind(document);
  var openSheetButton = $("#open-sheet-".concat(id));
  var sheet = $("#sheet-".concat(id));
  var sheetContents = sheet.querySelector(".contents");
  var draggableArea = sheet.querySelector(".draggable-area");
  var sheetHeight; // in vh

  var setSheetHeight = function setSheetHeight(value) {
    sheetHeight = Math.max(0, Math.min(100, value));
    sheetContents.style.height = "".concat(sheetHeight, "vh");

    if (sheetHeight === 100) {
      sheetContents.classList.add("fullscreen");
    } else {
      sheetContents.classList.remove("fullscreen");
    }
  };

  var setIsSheetShown = function setIsSheetShown(isShown) {
    sheet.setAttribute("aria-hidden", String(!isShown));

    if (isShown) {
      document.body.style.overflow = "hidden";
      sheet.addEventListener("touchmove", preventScroll);
    } else {
      document.body.style.overflow = "";
      sheet.removeEventListener("touchmove", preventScroll);
    }
  };

  var preventScroll = function preventScroll(event) {
    event.preventDefault();
  }; // Open the sheet when clicking the 'open sheet' button
  // openSheetButton.addEventListener("click", () => {


  if (window.innerWidth < 768) {
    // only enable sheet on mobile screens
    setSheetHeight(Math.min(50, 720 / window.innerHeight * 100));
    setIsSheetShown(true);
  } // })
  // Hide the sheet when clicking the 'close' button


  sheet.querySelector(".close-sheet").addEventListener("click", function () {
    setIsSheetShown(false);
  }); // Hide the sheet when clicking the background

  sheet.querySelector(".overlay").addEventListener("click", function () {
    setIsSheetShown(false);
  });

  var isFocused = function isFocused(element) {
    return document.activeElement === element;
  }; // Hide the sheet when pressing Escape if the target element
  // is not an input field


  window.addEventListener("keyup", function (event) {
    var isSheetElementFocused = sheet.contains(event.target) && isFocused(event.target);

    if (event.key === "Escape" && !isSheetElementFocused) {
      setIsSheetShown(false);
    }
  });

  var touchPosition = function touchPosition(event) {
    return event.touches ? event.touches[0] : event;
  };

  var dragPosition;

  var onDragStart = function onDragStart(event) {
    dragPosition = touchPosition(event).pageY;
    sheetContents.classList.add("not-selectable");
    draggableArea.style.cursor = document.body.style.cursor = "grabbing";
  };

  var onDragMove = function onDragMove(event) {
    if (dragPosition === undefined) return;
    var y = touchPosition(event).pageY;
    var deltaY = dragPosition - y;
    var deltaHeight = deltaY / window.innerHeight * 100;
    setSheetHeight(sheetHeight + deltaHeight);
    dragPosition = y;
  };

  var onDragEnd = function onDragEnd() {
    dragPosition = undefined;
    sheetContents.classList.remove("not-selectable");
    draggableArea.style.cursor = document.body.style.cursor = "";

    if (sheetHeight < 25) {
      setIsSheetShown(false);
    } else if (sheetHeight > 75) {
      setSheetHeight(100);
    } else {
      setSheetHeight(50);
    }
  };

  draggableArea.addEventListener("mousedown", onDragStart);
  draggableArea.addEventListener("touchstart", onDragStart);
  window.addEventListener("mousemove", onDragMove);
  window.addEventListener("touchmove", onDragMove);
  window.addEventListener("mouseup", onDragEnd);
  window.addEventListener("touchend", onDragEnd);
}

function disablePopover() {
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

function recommendUsers() {
  var usr_id;
  return regeneratorRuntime.async(function recommendUsers$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          usr_id = JSON.parse(sessionStorage.getItem('user')).usr_id;
          fetch("".concat(serverUrl, "/api/topUsers/").concat(usr_id)).then(function (data) {
            return data.json();
          }).then(function (resp) {
            return console.log(resp);
          });

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function emoji() {
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