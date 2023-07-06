"use strict";

var serverUrl = 'http://localhost:3000';

function find(target) {
  var value, parentElement;
  return regeneratorRuntime.async(function find$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          value = document.getElementById('find_input').value;
          parentElement = document.getElementById('search_results_grid');
          _context.next = 4;
          return regeneratorRuntime.awrap(fetch("".concat(serverUrl, "/api/find/").concat(target, "/").concat(value)).then(function (resp) {
            return resp.json();
          }).then(function (items) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var item = _step.value;
                // Create the main item container
                var itemContainer = document.createElement('div');
                itemContainer.classList.add('item'); // Create the item content container

                var itemContent = document.createElement('div');
                itemContent.classList.add('item-content'); // Create the card container

                var card = document.createElement('div');
                card.classList.add('card', 'fmini_card'); // Create the card body container

                var cardBody = document.createElement('div');
                cardBody.classList.add('card-body'); // Create the fmini user info container

                var fminiUserInfo = document.createElement('div');
                fminiUserInfo.classList.add('fmini_user_info'); // Create the user profile picture

                var userProfilePic = document.createElement('img');
                userProfilePic.classList.add('fmini_user_profile_pic');
                userProfilePic.src = 'https://drive.google.com/uc?export=view&id=' + item.prflimg;
                userProfilePic.alt = '';
                userProfilePic.srcset = ''; // Create the fmini user name and ID container

                var fminiUserNameId = document.createElement('div');
                fminiUserNameId.classList.add('fmini_user_name_id'); // Create the user name element

                var userName = document.createElement('div');
                userName.classList.add('fmini_user_username');
                userName.textContent = item.name; // Create the user ID element

                var userID = document.createElement('div');
                userID.classList.add('fmini_user_userid');
                userID.textContent = '@' + item.userId; // Append the userName and userID elements to fminiUserNameId

                fminiUserNameId.appendChild(userName);
                fminiUserNameId.appendChild(userID); // Append the userProfilePic, fminiUserNameId, and fminiOptions to fminiUserInfo

                fminiUserInfo.appendChild(userProfilePic);
                fminiUserInfo.appendChild(fminiUserNameId); // Append fminiUserInfo to cardBody

                cardBody.appendChild(fminiUserInfo);
                console.log('item : ', item);
                console.log(item.fmini.media); // Create the fmini media container (if fmini.media exists)

                if (item.fmini.media) {
                  var fminiMedia = document.createElement('div'); // Check if the media is a tenor or a drive image and create the appropriate image element

                  if (item.fmini.media.includes('tenor')) {
                    var mediaImage = document.createElement('img');
                    mediaImage.src = item.fmini.media;
                    mediaImage.alt = '';
                    mediaImage.srcset = '';
                    fminiMedia.appendChild(mediaImage);
                    mediaImage.classList.add('fmini_media');
                    console.log('tenor');
                  } else {
                    var mediaImage = document.createElement('img');
                    mediaImage.src = 'https://drive.google.com/uc?export=view&id=' + item.fmini.media;
                    mediaImage.alt = '';
                    mediaImage.srcset = '';
                    fminiMedia.appendChild(mediaImage);
                    mediaImage.classList.add('fmini_media');
                    console.log('img');
                  } // Append fminiMedia to cardBody


                  cardBody.appendChild(fminiMedia);
                }

                var num = Math.round(Math.random() * 10);
                var itemClass;

                if (num % 2 == 0) {
                  itemClass = 'small';
                } else {
                  itemClass = 'large';
                } // Create the fmini body element


                var fminiBody = document.createElement('div');
                fminiBody.classList.add('fmini_body', itemClass);
                fminiBody.textContent = item.fmini.body; // Append cardBody and fminiBody to card

                card.appendChild(cardBody);
                card.appendChild(fminiBody); // Append card to itemContent

                itemContent.appendChild(card); // Append itemContent to itemContainer

                itemContainer.appendChild(itemContent);
                parentElement.appendChild(itemContainer);
                document.getElementById('placeholders').style.display = 'none';
                var gridA = new Muuri('#search_results_grid');
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                  _iterator["return"]();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }
          }));

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
}