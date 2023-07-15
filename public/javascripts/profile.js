// var croppr = new Croppr('#edthdr', {
//   aspectRatio : 0.3,
//   onCropEnd: function(value) {
//     resizeImage(document.getElementsByClassName('croppr-image')[0].src, value.width, value.height,value.x, value.y, (img)=>{console.log(img)})
// }
//      });
//   var value = croppr.getValue(); 
 async function fetchTopUsers(){
    await fetch('/api/topUsers').then(res => res.json()).then(data =>{
      for(user of data ){
         const listItem = document.createElement("li");
         listItem.classList.add("list-group-item");
       
         const userContainer = document.createElement("div");
         userContainer.classList.add("d-flex");
       
         if (user.prflimg) {
           const profileImg = document.createElement("img");
           profileImg.classList.add('top_users_img')
           profileImg.src = `https://drive.google.com/uc?export=view&id=${user.prflimg}`;
           profileImg.alt = "Profile Image";
           userContainer.appendChild(profileImg);
         } else {
           const placeholderDiv = document.createElement("div");
           placeholderDiv.style.width = "50px";
           userContainer.appendChild(placeholderDiv);
         }
       
         const nameContainer = document.createElement("div");
         nameContainer.classList.add("usr_names", "vstack");
       
         const userName = document.createElement("a");
         userName.href = `/user/${user._id}`;
         userName.classList.add("user_name");
         userName.textContent = user.name;
         nameContainer.appendChild(userName);
       
         const userID = document.createElement("a");
         userID.href =  `/user/${user._id}`;
         userID.classList.add("user_id");
         userID.textContent = `@${user.userId}`;
         nameContainer.appendChild(userID);
       
         const followButton = document.createElement("button");
         followButton.classList.add("btn", "btn-default");
         followButton.setAttribute('onclick', `follow('${user._id}')`)
         followButton.textContent = "Follow";
       
         userContainer.appendChild(nameContainer);
         userContainer.appendChild(followButton);
       
         listItem.appendChild(userContainer);
         document.getElementById('top_users').appendChild(listItem)
      }
    })
    document.getElementById('top_users_spinner').style.display = 'none'
 }
 async function fetchUserLikes(){
  const user = parseJwt(getCookie('indigotoken'))
  const ul = document.getElementById('user_likes_lists')
  fetch(`/api/likes/${user._id}`).then(res => res.json()).then(data =>{
    for(item of data) {
      // Create the avatar image element
      const avatarImg = document.createElement('img');
      avatarImg.className = 'avator';
      if(user.prflImg){
        avatarImg.src = `https://drive.google.com/uc?export=view&id=${user.prflImg}`;
      }else{
        avatarImg.style.background = 'crimson'
        avatarImg.style.width = '50px'
        avatarImg.style.height = '50px'
      }
      avatarImg.alt = '';
    
      // Create the user name and ID elements
      const userNameSpan = document.createElement('span');
      userNameSpan.textContent = user.name;
      
      const userIdSpan = document.createElement('span');
      userIdSpan.className = 'usrid';
      userIdSpan.textContent = `@${user.userId}`;
    
      const userNameIdDiv = document.createElement('div');
      userNameIdDiv.className = 'user_name_id vstack';
      userNameIdDiv.appendChild(userNameSpan);
      userNameIdDiv.appendChild(userIdSpan);
    
      // Create the popover link element
      // const popoverLink = document.createElement('a');
      // popoverLink.className = 'ms-auto';
      // popoverLink.tabIndex = '0';
      // popoverLink.setAttribute('data-bs-toggle', 'popover');
      // popoverLink.setAttribute('data-bs-html', 'true');
      // popoverLink.setAttribute('data-bs-trigger', 'focus');
      // // popoverLink.setAttribute('data-bs-content', '<div class="list-group list-group-flush"><a href="#" class="list-group-item list-group-item-action" aria-current="true">The current link item</a><a href="#" class="list-group-item list-group-item-action">A second link item</a><a href="#" class="list-group-item list-group-item-action">A third link item</a><a href="#" class="list-group-item list-group-item-action">A fourth link item</a><a class="list-group-item list-group-item-action">A disabled link item</a></div>');
      
      // const popoverIcon = document.createElement('i');
      // popoverIcon.className = 'fa-solid fa-ellipsis-vertical';
      
      // popoverLink.appendChild(popoverIcon);
    
      // Create the dream header info element
      const dreamHeaderInfoDiv = document.createElement('div');
      dreamHeaderInfoDiv.className = 'dream-header-info';
      dreamHeaderInfoDiv.appendChild(userNameIdDiv);
      // dreamHeaderInfoDiv.appendChild(popoverLink);
    
      // Create the dream header element
      const dreamHeaderDiv = document.createElement('div');
      dreamHeaderDiv.className = 'dream-header hstack';
      dreamHeaderDiv.appendChild(avatarImg);
      dreamHeaderDiv.appendChild(dreamHeaderInfoDiv);
    
      // Create the fmini body element
      const fminiBodyLink = document.createElement('a');
      if(item.parent == 'fmini'){
        fminiBodyLink.href = `/fmini/${item._id}`;
      }else if(item.parent == 'fantom'){
        fminiBodyLink.href = `/fantom/${item._id}`;
      }else{
        fminiBodyLink.href = `/alanrep/${item._id}`;
      }
      fminiBodyLink.textContent = item.body;
    
      const fminiBodyDiv = document.createElement('div');
      fminiBodyDiv.className = 'fmini_body';
      fminiBodyDiv.appendChild(fminiBodyLink);
    
      // // Create the fmini tags element
      // const fminiTagsDiv = document.createElement('div');
      // fminiTagsDiv.className = 'fmini_tags';
    
      // for (const tag of annex.tags) {
      //   const tagDiv = document.createElement('div');
      //   tagDiv.className = 'tag-light';
      //   tagDiv.textContent = tag;
      //   fminiTagsDiv.appendChild(tagDiv);
      // }
    
      // Create the dream img wrap element
      let dreamImgWrapDiv;
      if (item.media) {
        dreamImgWrapDiv = document.createElement('div');
        dreamImgWrapDiv.className = 'dream-img-wrap';
    
        if (item.media.includes('tenor')) {
          const fminiMediaImg = document.createElement('img');
          fminiMediaImg.className = 'fmini_media';
          fminiMediaImg.src = item.media;
          fminiMediaImg.alt = '';
          fminiMediaImg.srcset = '';
    
          dreamImgWrapDiv.appendChild(fminiMediaImg);
        } else {
          const fminiMediaImg = document.createElement('img');
          fminiMediaImg.className = 'fmini_media';
          fminiMediaImg.src = `https://drive.google.com/uc?export=view&id=${item.media}`;
          fminiMediaImg.alt = '';
          fminiMediaImg.setAttribute('data-bs-toggle', 'modal');
          fminiMediaImg.setAttribute('data-bs-target', `#${item._id}`);
    
          dreamImgWrapDiv.appendChild(fminiMediaImg);
        }
      }
    
      // // Create the modal content element
      // let modalContentDiv;
      // if (annex.media) {
      //   const modalImg = document.createElement('img');
      //   modalImg.className = 'modal-img';
      //   modalImg.src = `https://drive.google.com/uc?export=view&id=${annex.media}`;
      //   modalImg.alt = '';
    
      //   const modalBodyDiv = document.createElement('div');
      //   modalBodyDiv.className = 'modal-body text-center vstack';
      //   modalBodyDiv.appendChild(modalImg);
    
      //   const modalHeaderButton = document.createElement('button');
      //   modalHeaderButton.className = 'btn-close';
      //   modalHeaderButton.setAttribute('type', 'button');
      //   modalHeaderButton.setAttribute('data-bs-dismiss', 'modal');
      //   modalHeaderButton.setAttribute('aria-label', 'Close');
    
      //   const modalHeaderDiv = document.createElement('div');
      //   modalHeaderDiv.className = 'modal-header';
      //   modalHeaderDiv.appendChild(modalHeaderButton);
    
      //   const modalContentDiv = document.createElement('div');
      //   modalContentDiv.className = 'modal-content';
      //   modalContentDiv.appendChild(modalHeaderDiv);
      //   modalContentDiv.appendChild(modalBodyDiv);
      // }
    
      // // Create the modal dialog element
      // let modalDialogDiv;
      // if (annex.media) {
      //   modalDialogDiv = document.createElement('div');
      //   modalDialogDiv.className = 'modal-dialog modal-fullscreen';
      //   modalDialogDiv.appendChild(modalContentDiv);
      // }
    
      // // Create the modal element
      // let modalDiv;
      // if (annex.media) {
      //   modalDiv = document.createElement('div');
      //   modalDiv.className = 'modal fade';
      //   modalDiv.tabIndex = '-1';
      //   modalDiv.setAttribute('aria-labelledby', 'exampleModalLabel');
      //   modalDiv.setAttribute('aria-hidden', 'true');
      //   modalDiv.id = `${annex._id}`;
      //   modalDiv.appendChild(modalDialogDiv);
      // }
    
      // Create the replies element
      const repliesButton = document.createElement('a');
      // repliesButton.className = 'btn btn-light mx-1';
      // repliesButton.setAttribute('type', 'button');
      repliesButton.href = `/${item._id}/replies`;
    
      const repliesIcon = document.createElement('div');
      repliesIcon.className = 'material-symbols-rounded';
      repliesIcon.textContent = 'reply';
    
      const repliesSpan = document.createElement('span');
      // repliesSpan.className = 'lapdisp';
      repliesSpan.textContent = item.replies_length;
    
      repliesButton.appendChild(repliesIcon);
      repliesButton.appendChild(repliesSpan);
    
      const repliesDiv = document.createElement('div');
      repliesDiv.className = 'replies';
      repliesDiv.appendChild(repliesButton);
    
      // Create the alters element
      const altersButton = document.createElement('a');
      // altersButton.className = 'btn btn-light mx-1';
      // altersButton.setAttribute('type', 'button');
      altersButton.href = `/${item._id}/alters`;
    
      const altersIcon = document.createElement('div');
      altersIcon.className = 'material-symbols-rounded';
      altersIcon.textContent = 'edit_note';
    
      const altersSpan = document.createElement('span');
      // altersSpan.className = 'lapdisp';
      altersSpan.textContent = item.alters_length;
    
      altersButton.appendChild(altersIcon);
      altersButton.appendChild(altersSpan);
    
      const altersDiv = document.createElement('div');
      altersDiv.className = 'alters';
      altersDiv.appendChild(altersButton);
    
      // Create the likes element
      const likesDiv = document.createElement('div');
      likesDiv.className = 'likes';
      likesDiv.setAttribute('onclick', `like('${item._id}', '${item._id}')`);
    
      const likesIcon = document.createElement('div');
      likesIcon.setAttribute('class', 'fill material-symbols-rounded')
      likesIcon.id = `like_btn_${item._id}`;
      likesIcon.textContent = 'favorite';
    
      const likesSpan = document.createElement('span');
      // likesSpan.className = 'lapdisp';
      likesSpan.id = `likes_total_${item._id}`
      likesSpan.textContent = item.likes_length;
    
      likesDiv.appendChild(likesIcon);
      likesDiv.appendChild(likesSpan);
    
      // Create the annexes element
      const annexesButton = document.createElement('a');
      annexesButton.href = `/${item._id}/annexures`;
    
      const annexesIcon = document.createElement('div');
      annexesIcon.className = 'material-symbols-rounded';
      annexesIcon.textContent = 'edit';
    
      const annexesSpan = document.createElement('span');
      // annexesSpan.className = 'lapdisp';
      annexesSpan.textContent = item.annexes_length;
    
      annexesButton.appendChild(annexesIcon);
      annexesButton.appendChild(annexesSpan);
    
      const annexesDiv = document.createElement('div');
      annexesDiv.className = 'annexes';
      annexesDiv.appendChild(annexesButton);
    
      // Create the share element
      // const shareDiv = document.createElement('div');
      // shareDiv.className = 'share';
    
      // const shareIcon = document.createElement('div');
      // shareIcon.className = 'material-symbols-rounded';
      // shareIcon.textContent = 'delete';
    
      // shareDiv.appendChild(shareIcon);
    
      // Create the dream info counts element
      const dreamInfoCountsDiv = document.createElement('div');
      dreamInfoCountsDiv.className = 'dream-info-counts d-flex justify-content-around';
      dreamInfoCountsDiv.appendChild(repliesDiv);
      dreamInfoCountsDiv.appendChild(altersDiv);
      dreamInfoCountsDiv.appendChild(likesDiv);
      dreamInfoCountsDiv.appendChild(annexesDiv);
      // dreamInfoCountsDiv.appendChild(shareDiv);
    
      // Create the fmini element
      const fminiDiv = document.createElement('div');
      fminiDiv.className = 'fmini';
      fminiDiv.appendChild(dreamHeaderDiv);
      fminiDiv.appendChild(fminiBodyDiv);
      fminiDiv.appendChild(dreamInfoCountsDiv);
    
      // Create the list group item element
      const listItem = document.createElement('li');
      listItem.className = 'list-group-item';
      listItem.appendChild(fminiDiv);
      ul.appendChild(listItem)
    
    }
    
    // 
  })
 }
 async function createFollowersList(userId, targetId) { //(user to find followers of, dom element to appen)
  await fetch(`api/${userId}/followers`).then(data=> data.json()).then(followers =>{
    document.getElementById('followers_users_spinner').style.display = 'none'
  var listContainer = document.getElementById(targetId)
    for(var follower of followers){
      // if (user.followers.length) {
      //   for (var i = 0; i < user.followers.length; i++) {
      //     var follower = user.followers[i];
    
          var listItem = document.createElement('li');
          listItem.className = 'list-group-item follows_list';
    
          var flexContainer = document.createElement('div');
          flexContainer.className = 'd-flex';
          
          var image;
          if(follower.prflimg){
            image = document.createElement('img');
            image.style.width = '50px'
            image.style.height = '50px'
            image.src =`https://drive.google.com/uc?export=view&id=${follower.prflimg}`;
            image.alt = '';
            image.srcset = '';
          }else{
            image = document.createElement('div')
            image.style.width = '50px'
            image.style.height = '50px'
            image.style.background = 'purple'
          }
    
    
          var namesContainer = document.createElement('div');
          namesContainer.className = 'usr_names vstack';
    
          var userName = document.createElement('div');
          userName.className = 'user_name';
          userName.textContent = follower.name;
    
          var userId = document.createElement('div');
          userId.className = 'user_id';
          userId.textContent = '@' + follower.userId;
    
          var followButton = document.createElement('button');
          followButton.className = 'btn btn-default';
          followButton.textContent = 'Follow back';
          followButton.setAttribute('onclick', `follow('${follower.user_id}')`);
    
          namesContainer.appendChild(userName);
          namesContainer.appendChild(userId);
    
          flexContainer.appendChild(image);
          flexContainer.appendChild(namesContainer);
    
          listItem.appendChild(flexContainer);
          listItem.appendChild(followButton);
    
          listContainer.appendChild(listItem);
        }
    //   }
    // }
  })
}
async function createFollowingList(userId, targetId) { //(user to find followers of, dom element to appen)
  await fetch(`api/${userId}/following`).then(data=> data.json()).then(followings =>{
    document.getElementById('following_users_spinner').style.display = 'none'
    console.log(followings)
  var listContainer = document.getElementById(targetId)
    for(var following of followings){
      // if (user.followers.length) {
      //   for (var i = 0; i < user.followers.length; i++) {
      //     var following = user.followers[i];
    
          var listItem = document.createElement('li');
          listItem.className = 'list-group-item follows_list';
    
          var flexContainer = document.createElement('div');
          flexContainer.className = 'd-flex';
          
          var image;
          if(following.prflimg){
            image = document.createElement('img');
            image.style.width = '50px'
            image.style.height = '50px'
            image.src =`https://drive.google.com/uc?export=view&id=${following.prflimg}`;
            image.alt = '';
            image.srcset = '';
          }else{
            image = document.createElement('div')
            image.style.width = '50px'
            image.style.height = '50px'
            image.style.background = 'purple'
          }
    
    
          var namesContainer = document.createElement('div');
          namesContainer.className = 'usr_names vstack';
    
          var userName = document.createElement('a');
          userName.href = `/user/${following.user_id}`
          userName.className = 'user_name';
          userName.textContent = following.name;
    
          var userId = document.createElement('a');
          userId.href = `/user/${following.user_id}`
          userId.className = 'user_id';
          userId.textContent = '@' + following.userId;
    
          var followButton = document.createElement('button');
          followButton.className = 'btn btn-default';
          followButton.textContent = 'Unfollow';
          followButton.setAttribute('onclick', `follow('${following.user_id}')`);
    
          namesContainer.appendChild(userName);
          namesContainer.appendChild(userId);
    
          flexContainer.appendChild(image);
          flexContainer.appendChild(namesContainer);
    
          listItem.appendChild(flexContainer);
          listItem.appendChild(followButton);
    
          listContainer.appendChild(listItem);
        }
    //   }
    // }
  })
}

 document.addEventListener('DOMContentLoaded', fetchUserLikes);  

 