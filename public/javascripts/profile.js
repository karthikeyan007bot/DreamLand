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
         followButton.classList.add("btn", "btn-primary");
         followButton.textContent = "Follow";
       
         userContainer.appendChild(nameContainer);
         userContainer.appendChild(followButton);
       
         listItem.appendChild(userContainer);
         document.getElementById('top_users').appendChild(listItem)
      }
    })
    document.getElementById('top_users_spinner').style.display = 'none'
 }
 