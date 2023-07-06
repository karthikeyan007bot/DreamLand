"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var _require = require('googleapis'),
    google = _require.google;

var popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');

var popoverList = _toConsumableArray(popoverTriggerList).map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl);
});

var oauth2Client = new google.auth.OAuth2('107645595769-al5lco2dmqo4k8da50skhh04v3reub4r.apps.googleusercontent.com', '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', 'https://developers.google.com/oauthplayground');
oauth2Client.setCredentials({
  refresh_token: '1//04XqJlix_lvj3CgYIARAAGAQSNwF-L9Irlgt5jNxMaJVZWyONfMZwncgbimOu2dcXRhViD4nhtruhCh7nlv0mA66WdNMo7gFjFc4'
});
var drive = google.drive({
  version: 'v3',
  auth: oauth2Client
});
var image = document.querySelector("#frontimg");
document.querySelectorAll('.feedback li').forEach(function (entry) {
  return entry.addEventListener('click', function (e) {
    console.log('clicked');

    if (!entry.classList.contains('active')) {
      document.querySelector('.feedback li.active').classList.remove('active');
      entry.classList.add('active');
    }

    e.preventDefault();
  });
});
var refresh_token = '1//04XqJlix_lvj3CgYIARAAGAQSNwF-L9Irlgt5jNxMaJVZWyONfMZwncgbimOu2dcXRhViD4nhtruhCh7nlv0mA66WdNMo7gFjFc4';

function embed(input, id) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    document.getElementsByClassName('close_img')[0].style.display = 'block';

    reader.onload = function (e) {
      document.querySelector("#media_preview_".concat(id)).setAttribute("src", e.target.result);
    };

    reader.readAsDataURL(input.files[0]);
  }
}

function readGif(e) {
  document.querySelector("#frontimg").setAttribute("src", e.src);
}

function showlimit() {
  var textareaElem = document.querySelector('#fantatxtarea');
  var counterElem = document.querySelector('.counter');
  var maxLengthCounter = 500;
  var countInput = textareaElem.value.length;
  counterElem.innerHTML = "".concat(countInput, "/").concat(maxLengthCounter);

  if (countInput > maxLengthCounter) {
    textareaElem.style.color = 'orangered';
    document.getElementById('postfmini').disabled = true;
    return;
  }

  document.getElementById('postfmini').disabled = false;
  textareaElem.style.color = 'black';
  return;
}

function closeMedia(id) {
  var image = document.querySelector("#media_preview_".concat(id));

  if (image.src) {
    image.src = '';
    image.display = 'none';
  }

  document.getElementsByClassName('close_img')[0].style.display = 'none';
}

function findPeople(target) {
  var user_id = event.target.value;
  var cookie = getCookie('indigotoken');
  var userIdA = parseJwt(cookie).userId;
  var ul = document.getElementById('msgresp');
  fetch("".concat(serverUrl, "/api//userByUserId/").concat(user_id)).then(function (res) {
    return res.json();
  }).then(function (data) {
    console.log(data);

    if (document.getElementsByClassName('msgrecep').length != 0) {
      document.querySelectorAll('.msgrecep').forEach(function (el) {
        return el.remove();
      });
    }

    _toConsumableArray(data.payload).forEach(function (e) {
      var src;

      if (e.prflimg) {
        src = "https://drive.google.com/uc?export=view&id=".concat(e.prflimg);
      } else {
        src = '/images/user-account-management-logo-user-icon-11562867145a56rus2zwu.png';
      }

      var li = document.createElement('li');
      li.classList.add('list-group-item', 'msgrecep');
      li.style.backgroundColor = 'transparent';
      li.innerHTML = "\n   <a href=\"http://localhost:3000/message/".concat(e.name, "/").concat(e.userId, "?recip=").concat(e.userId, "\">\n       <img src=\"").concat(src, "\" alt=\"\" class=\"msg-to-list-img float-start me-1\">\n       <div class=\"msg-accnt-info\"></div>\n       <strong>").concat(e.name, "</strong>\n       <br>\n       <em>@").concat(e.userId, "</em>\n   </a>\n   ");
      ul.appendChild(li);
    });
  });
}

function formatDate(dat) {
  var date = new Date(dat);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
} // fantom post


document.getElementById("fmsubmit").addEventListener("click", function _callee2(event) {
  var media, tokenRequest, accessToken, metadata, form;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          media = document.getElementById('media_preview_cvrimg').src;
          _context2.next = 3;
          return regeneratorRuntime.awrap(fetch(media).then(function (res) {
            return res.blob();
          }).then(function (blob) {
            return media = blob;
          }));

        case 3:
          _context2.next = 5;
          return regeneratorRuntime.awrap(axios.request({
            method: 'post',
            url: "https://oauth2.googleapis.com/token",
            headers: {
              "content-type": "application/x-www-form-urlencoded"
            },
            params: {
              client_id: '107645595769-al5lco2dmqo4k8da50skhh04v3reub4r.apps.googleusercontent.com',
              client_secret: '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',
              refresh_token: '1//04XqJlix_lvj3CgYIARAAGAQSNwF-L9Irlgt5jNxMaJVZWyONfMZwncgbimOu2dcXRhViD4nhtruhCh7nlv0mA66WdNMo7gFjFc4',
              grant_type: "refresh_token"
            }
          })["catch"](function (e) {
            return console.log(e);
          }));

        case 5:
          tokenRequest = _context2.sent;
          accessToken = tokenRequest.data["access_token"];
          console.log('Access token : ' + accessToken);
          metadata = {
            'name': 'sampleName',
            // Filename at Google Drive
            'mimeType': 'image/png' // mimeType at Google Drive

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
          }).then(function _callee(val) {
            var filedId, body;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    filedId = val.id;
                    _context.next = 3;
                    return regeneratorRuntime.awrap(drive.permissions.create({
                      filedId: filedId,
                      requestBody: {
                        role: 'reader',
                        type: 'anyone'
                      }
                    }).then(console.log('permission granted for everyone')));

                  case 3:
                    body = {
                      title: document.getElementById('drmttl').value,
                      desc: document.getElementById('drmdesc').value,
                      cover: val.id,
                      usrRefId: parseJwt(getCookie('indigotoken'))._id,
                      tags: tagInputsOf('ftags'),
                      catagory: RadioValueOf('catagory'),
                      prota: tagInputsOf('prota'),
                      anta: tagInputsOf('anto'),
                      deuta: tagInputsOf('deu'),
                      tert: tagInputsOf('ter'),
                      feelings: checkBoxValueOf('feeling'),
                      age_rating: document.getElementById('age_rating').checked,
                      who_can_see: RadioValueOf('who_can_see'),
                      post_as: RadioValueOf('post_as'),
                      backGround: tagInputsOf('background') // body : editor.getData()

                    };
                    fetch('/fantomPost', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(body)
                    }).then(function () {//  window.location.href = '/'
                    })["catch"](function (err) {
                      console.log(err);
                    });

                  case 5:
                  case "end":
                    return _context.stop();
                }
              }
            });
          });

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  });
});
window.addEventListener("online", function () {
  alert("I am connected to the internet");
});
window.addEventListener("offline", function () {
  alert("Disconnected...so sad!!!");
});

var User = function User(usr_name, usr_id, followers, following) {
  _classCallCheck(this, User);

  this.usr_name = usr_name;
  this.usr_id = usr_id;
  this.followers = followers;
  this.following = following;
};

function setUserPic() {
  var prflimg = parseJwt(getCookie('indigotoken')).prflImg;
  document.getElementById('usr_pic').src = "https://drive.google.com/uc?export=view&id=".concat(prflimg);
  var user = new User(window.usr_name, window.usr_id);
  window.sessionStorage.setItem('user', JSON.stringify(user));
}

function adjustGridWidth() {
  var grid = document.querySelector('.grid');
  var totalWidth = 0;
  Array.from(grid.children).forEach(function (item) {
    totalWidth += item.offsetWidth;
  });
  grid.style.width = totalWidth + 'px';
}

window.addEventListener('DOMContentLoaded', adjustGridWidth);
window.addEventListener('resize', adjustGridWidth);