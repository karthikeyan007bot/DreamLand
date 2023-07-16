var serverUrl = 'https://dreams.vercel.app/'
async function find(target){
    var value = document.getElementById('find_input').value;
    var parentElement = document.getElementById('search_results_grid')
    var spinner = document.getElementById('search_spinner')
   await fetch(`${serverUrl}/api/find/${target}/${value}`).then(resp => resp.json()).then( items =>{
    if(items.length){
      document.getElementById('no_search_result').style.display = 'none'
    if(document.getElementsByClassName('item').length){
      var removedItemsA = grid.remove(grid.getItems(),{ removeElements: true });
    }
    document.getElementById('placeholders').style.display = 'none'
    spinner.style.display = 'block'
    for(let item of items){
         // Create the main item container
  var itemContainer = document.createElement('div');
  itemContainer.classList.add('item');

  // Create the item content container
  var itemContent = document.createElement('div');
  itemContent.classList.add('item-content');

  // Create the card container
  var card = document.createElement('div');
  card.classList.add('card', 'fmini_card');

  // Create the card body container
  var cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  // Create the fmini user info container
  var fminiUserInfo = document.createElement('div');
  fminiUserInfo.classList.add('fmini_user_info');

  // Create the user profile picture
  var userProfilePic = document.createElement('img');
  userProfilePic.classList.add('fmini_user_profile_pic');
  userProfilePic.src = 'https://drive.google.com/uc?export=view&id=' + item.prflimg;
  userProfilePic.alt = '';
  userProfilePic.srcset = '';

  // Create the fmini user name and ID container
  var fminiUserNameId = document.createElement('a');
  fminiUserNameId.href = `/user/${item.user_id}`
  fminiUserNameId.classList.add('fmini_user_name_id');

  // Create the user name element
  var userName = document.createElement('div');
  userName.classList.add('fmini_user_username');
  userName.textContent = item.name;

  // Create the user ID element
  var userID = document.createElement('div');
  userID.classList.add('fmini_user_userid');
  userID.textContent = '@' + item.userId;

  // Append the userName and userID elements to fminiUserNameId
  fminiUserNameId.appendChild(userName);
  fminiUserNameId.appendChild(userID);

  // Append the userProfilePic, fminiUserNameId, and fminiOptions to fminiUserInfo
  fminiUserInfo.appendChild(userProfilePic);
  fminiUserInfo.appendChild(fminiUserNameId);

  // Append fminiUserInfo to cardBody
  cardBody.appendChild(fminiUserInfo);
  // Create the fmini media container (if fmini.media exists)
  if (item.media) {
    var fminiMedia = document.createElement('div');
    // Check if the media is a tenor or a drive image and create the appropriate image element
    if (item.media.includes('tenor')) {
      var mediaImage = document.createElement('img');
      mediaImage.src = item.media;
      mediaImage.alt = '';
      mediaImage.srcset = '';
      fminiMedia.appendChild(mediaImage);
    mediaImage.classList.add('fmini_media');
    } else {
      var mediaImage = document.createElement('img');
      mediaImage.src = 'https://drive.google.com/uc?export=view&id=' + item.media;
      mediaImage.alt = '';
      mediaImage.srcset = '';
      fminiMedia.appendChild(mediaImage);
    mediaImage.classList.add('fmini_media');
    }

    // Append fminiMedia to cardBody
    cardBody.appendChild(fminiMedia);
  }
  var num = Math.round(Math.random()*10);
  var itemClass
  if(num %2 == 0){
    itemClass = 'small'
  }else{
    itemClass = 'large'
  }
  // Create the fmini body element
  var fminiBody = document.createElement('a');
  fminiBody.href=`/fmini/${item._id}`
  fminiBody.classList.add('fmini_body', itemClass);
  fminiBody.textContent = item.body;

  // Append cardBody and fminiBody to card
  card.appendChild(cardBody);
  card.appendChild(fminiBody);

  // Append card to itemContent
  itemContent.appendChild(card);

  // Append itemContent to itemContainer
  itemContainer.appendChild(itemContent);
  spinner.style.display = 'none'
  grid.add([itemContainer])
}
       }else{
      document.getElementById('no_search_result').style.display = 'block'
      if(document.getElementsByClassName('item').length){
        var removedItemsA = grid.remove(grid.getItems(),{ removeElements: true });
      }
    }
   }
   )
}