"use strict";

var refresh_token = '1//04CTkYp1kZdtMCgYIARAAGAQSNwF-L9IrIxZ08KZkzmo5-zfWLnqIUEKcmPVTZHopiEUKk3TD3gMzblOhj9SjLBgJlyNldUthRio';

function postFminiTarget(fminiId, target) {
  var body, media, refId, tokenRequest, accessToken, metadata, form;
  return regeneratorRuntime.async(function postFminiTarget$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          refId = parseJwt(getCookie('indigotoken'))._id;
          fminiId = fminiId;
          media = document.getElementById("".concat(target, "_media_preview_").concat(fminiId)).src;
          body = document.getElementById("".concat(target, "_").concat(fminiId)).value;

          if (!media.includes('tenor')) {
            _context2.next = 8;
            break;
          }

          media = media;
          _context2.next = 24;
          break;

        case 8:
          if (!media.includes('png' || 'png')) {
            _context2.next = 23;
            break;
          }

          _context2.next = 11;
          return regeneratorRuntime.awrap(fetch(url).then(function (res) {
            return res.blob();
          }).then(function (blob) {
            return media = blob;
          }));

        case 11:
          _context2.next = 13;
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

        case 13:
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
            var filedId;
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
                    media = val.id;

                  case 4:
                  case "end":
                    return _context.stop();
                }
              }
            });
          });
          _context2.next = 24;
          break;

        case 23:
          media = undefined;

        case 24:
          _context2.next = 26;
          return regeneratorRuntime.awrap(axios.post("/api/postFminiTarget", {
            target: target,
            body: body,
            fminiId: fminiId,
            usrRefId: refId,
            media: media
          }).then(function (resp) {
            return window.location.href = '/fminiFeed';
          }));

        case 26:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function postCommonReply(id, fminiRefId) {
  var media, refId, reply, tokenRequest, accessToken, metadata, form;
  return regeneratorRuntime.async(function postCommonReply$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          // var reply_to_reply, reply_to_annex= false;
          // var regxp1 = /annex-[A-Za-z0-9]+/ ; 
          media = undefined;
          refId = parseJwt(getCookie('indigotoken'))._id; // user reference id

          media = document.getElementById("replyImg".concat(id)).src;
          reply = document.getElementById("replyBody".concat(id)).value;

          if (!media.includes('https://media.tenor.com')) {
            _context4.next = 8;
            break;
          }

          media = media;
          _context4.next = 20;
          break;

        case 8:
          if (!media.includes('png' || 'jpg')) {
            _context4.next = 20;
            break;
          }

          _context4.next = 11;
          return regeneratorRuntime.awrap(fetch(url).then(function (res) {
            return res.blob();
          }).then(function (blob) {
            return media = blob;
          }));

        case 11:
          _context4.next = 13;
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

        case 13:
          tokenRequest = _context4.sent;
          accessToken = tokenRequest.data["access_token"];
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
          }).then(function _callee2(val) {
            var filedId;
            return regeneratorRuntime.async(function _callee2$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    filedId = val.id;
                    _context3.next = 3;
                    return regeneratorRuntime.awrap(drive.permissions.create({
                      filedId: filedId,
                      requestBody: {
                        role: 'reader',
                        type: 'anyone'
                      }
                    }).then(console.log('permission granted for everyone')));

                  case 3:
                    media = val.id;

                  case 4:
                  case "end":
                    return _context3.stop();
                }
              }
            });
          });

        case 20:
          axios.post('http://localhost:3000/api/postCommonReply', {
            reply: reply,
            parentId: id,
            refId: refId,
            fminiRefId: fminiRefId,
            media: media
          }).then(function (resp) {
            return window.location.href = '/fminiFeed';
          });

        case 21:
        case "end":
          return _context4.stop();
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  var pCardAddButtons = document.getElementsByClassName("pCard_add");
  Array.from(pCardAddButtons).forEach(function (button) {
    button.addEventListener("click", function () {
      var pCardCards = document.getElementsByClassName("pCard_card");
      Array.from(pCardCards).forEach(function (card) {
        card.classList.toggle("pCard_on");
      });
      var pCardAddIcons = document.querySelectorAll(".pCard_add i");
      Array.from(pCardAddIcons).forEach(function (icon) {
        icon.classList.toggle("fa-minus");
      });
    });
  });
});