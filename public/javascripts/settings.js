var serverUrl = 'https://dreamverse.vercel.app/'
function saveSettings(){
  var blocked_users = []
  if(document.getElementsByClassName('block_users').length != 0){
    document.querySelectorAll('.block_users').forEach(el => {
        if(el.children[0].children[1].children[1].children[0].checked == true){
            blocked_users.push(el.id)
        }
        })
  }
  var body = {
     hide_sensitivity : document.getElementById('hide_sensitivity').checked,
     profile_visibility : document.getElementById('profile_visibility').checked,
     direct_message : RadioValueOf('direct_message'),
     blocked_users : blocked_users
  }
  fetch('/api/block', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  }).then(()=>{
    const saved_toast = document.getElementById('saved_toast')
   const savedToastBootstrap = bootstrap.Toast.getOrCreateInstance(saved_toast)
     savedToastBootstrap.show()
   }).catch(err => console.log(err))
}

function report_user(id){
  var body = {
     reporting_user : parseJwt(getCookie('indigotoken'))._id,
     reported_user : id,
     report : RadioValueOf('report_user_radio'),
     detail : document.getElementById('report_user_textarea').value    
  }
  fetch('/api/report', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  }).then(()=>{
   const toastLiveExample = document.getElementById('reported_toast')
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
    toastBootstrap.show()
  }).catch(err => console.log(err))
}
function expandParentWidth(id) {
    const parentElement = document.getElementById(id); // Replace 'parentElement' with the ID or selector of your parent element
    const childElements = parentElement.children;
    
    let totalWidth = 0;
    for (let i = 0; i < childElements.length; i++) {
      totalWidth += childElements[i].offsetWidth;
    }
    
    parentElement.style.width = totalWidth + 'px';
  }
  
function generateBlockUser(){
    var user_id = event.target.value
    var blocked_users = document.getElementById('blocked_users')
    fetch(`api/userByUserId/${user_id}`).then(data => data.json()).then(data => {
        var results = data.payload
        if(document.getElementsByClassName('block_users').length != 0){
            document.querySelectorAll('.block_users').forEach(el => {
                if(el.children[0].children[1].children[1].children[0].checked == false){
                    el.remove()
                }
                })
          }
        for(result of results){
            var src;
            if(result.prflimg){
              src = `https://drive.google.com/uc?export=view&id=${result.prflimg}`
            }else{
              src = '/images/user-account-management-logo-user-icon-11562867145a56rus2zwu.png'
            }
                const cardDiv = document.createElement('div');
                cardDiv.classList.add('card', 'text-center', 'p-2', 'block_users', 'mx-2');
                cardDiv.style.width = '450px';
                cardDiv.id = result._id
                
                const cardBodyDiv = document.createElement('div');
                cardBodyDiv.classList.add('card-body', 'text-center');
                
                const flexDiv = document.createElement('div');
                flexDiv.classList.add('d-flex');
                
                const userImg = document.createElement('img');
                userImg.src = src;
                userImg.alt = '';
                userImg.classList.add('usr_img');
                
                const textStartDiv = document.createElement('div');
                textStartDiv.classList.add('ms-4', 'text-start');
                
                const userNameDiv = document.createElement('div');
                userNameDiv.classList.add('usr_name');
                userNameDiv.textContent = result.name
                
                const userIdDiv = document.createElement('div');
                userIdDiv.classList.add('usr_id');
                userIdDiv.textContent = result.userId
                
                textStartDiv.appendChild(userNameDiv);
                textStartDiv.appendChild(userIdDiv);
                
                flexDiv.appendChild(userImg);
                flexDiv.appendChild(textStartDiv);
                
                const actionsDiv = document.createElement('div');
                actionsDiv.classList.add('d-flex', 'mt-4');
                
                const viewProfileLink = document.createElement('a');
                viewProfileLink.classList.add('btn', 'btn-light');
                viewProfileLink.setAttribute('href', `profile/${result._id}`);
                viewProfileLink.textContent = 'View Profile';
                
                const formCheckDiv = document.createElement('div');
                formCheckDiv.classList.add('form-check', 'form-switch', 'ms-2');
                
                const formCheckInput = document.createElement('input');
                formCheckInput.classList.add('form-check-input', 'block_user_check');
                formCheckInput.setAttribute('type', 'checkbox');
                formCheckInput.setAttribute('role', 'switch');
                
                const formCheckLabel = document.createElement('label');
                formCheckLabel.classList.add('form-check-label');
                formCheckLabel.setAttribute('for', '');
                formCheckLabel.textContent = 'Block user';
                
                formCheckDiv.appendChild(formCheckInput);
                formCheckDiv.appendChild(formCheckLabel);
                
                actionsDiv.appendChild(viewProfileLink);
                actionsDiv.appendChild(formCheckDiv);
                
                cardBodyDiv.appendChild(flexDiv);
                cardBodyDiv.appendChild(actionsDiv);
                
                cardDiv.appendChild(cardBodyDiv);
                
                blocked_users.appendChild(cardDiv)   
                expandParentWidth('blocked_users')
              }
                          
    })    
}
function generateReportUser(){
    var user_id = event.target.value
    var reported_users = document.getElementById('reported_users')
    fetch(`api/userByUserId/${user_id}`).then(data => data.json()).then(data => {
        var results = data.payload
        if(document.getElementsByClassName('report_users').length != 0){
            document.querySelectorAll('.report_users').forEach(el => {
                    el.remove()
                })
          }
        for(result of results){
            var src;
            if(result.prflimg){
              src = `https://drive.google.com/uc?export=view&id=${result.prflimg}`
            }else{
              src = '/images/user-account-management-logo-user-icon-11562867145a56rus2zwu.png'
            }
                const cardDiv = document.createElement('div');
                cardDiv.classList.add('card', 'text-center', 'p-2', 'report_users', 'mx-2');
                cardDiv.style.width = '450px';
                cardDiv.id = result.userId
                
                const cardBodyDiv = document.createElement('div');
                cardBodyDiv.classList.add('card-body', 'text-center');
                
                const flexDiv = document.createElement('div');
                flexDiv.classList.add('d-flex');
                
                const userImg = document.createElement('img');
                userImg.src = src;
                userImg.alt = '';
                userImg.classList.add('usr_img');
                
                const textStartDiv = document.createElement('div');
                textStartDiv.classList.add('ms-4', 'text-start');
                
                const userNameDiv = document.createElement('div');
                userNameDiv.classList.add('usr_name');
                userNameDiv.textContent = result.name
                
                const userIdDiv = document.createElement('div');
                userIdDiv.classList.add('usr_id');
                userIdDiv.textContent = `@${result.userId}`
                
                textStartDiv.appendChild(userNameDiv);
                textStartDiv.appendChild(userIdDiv);
                
                flexDiv.appendChild(userImg);
                flexDiv.appendChild(textStartDiv);
                
                const actionsDiv = document.createElement('div');
                actionsDiv.classList.add('d-flex', 'mt-4');
                
                const viewProfileLink = document.createElement('a');
                viewProfileLink.classList.add('btn', 'btn-light');
                viewProfileLink.setAttribute('href', `profile/${result._id}`);
                viewProfileLink.textContent = 'View Profile';
                
                const formCheckDiv = document.createElement('div');
                formCheckDiv.classList.add('form-check', 'form-switch', 'ms-2');
                
                const modal_button = document.createElement('button')
                modal_button.setAttribute('type', 'button')
                modal_button.setAttribute('data-bs-toggle', 'modal');
                modal_button.setAttribute('data-bs-target', '#report_user_modal');
                modal_button.setAttribute('data-bs-backdrop', 'static');
                modal_button.setAttribute('data-bs-report_userId', result.userId);
                modal_button.setAttribute('data-bs-report_id', result._id);
                modal_button.classList.add('btn','btn-light')
                modal_button.textContent = 'Report'

                
                formCheckDiv.appendChild(modal_button);
                
                actionsDiv.appendChild(viewProfileLink);
                actionsDiv.appendChild(formCheckDiv);
                
                cardBodyDiv.appendChild(flexDiv);
                cardBodyDiv.appendChild(actionsDiv);
                
                cardDiv.appendChild(cardBodyDiv);
                
                reported_users.appendChild(cardDiv)   
                expandParentWidth('reported_users')
              }
                          
    })    
}
function modal_recipent() {
var report_user_modal = document.getElementById('report_user_modal')
if (report_user_modal) {
  report_user_modal.addEventListener('show.bs.modal', event => {
    // Button that triggered the modal
    var button = event.relatedTarget
    // Extract info from data-bs-* attributes
    var recipient = button.getAttribute('data-bs-report_userId')
    var recipient_id = button.getAttribute('data-bs-report_id')
    // If necessary, you could initiate an Ajax request here
    // and then do the updating in a callback.

    // Update the modal's content.
    var modalBodyInput = report_user_modal.querySelector('.modal-body input')
    var modalBodyButton = report_user_modal.querySelector('.modal-body button')

    modalBodyInput.value = `Reporting ${recipient}`
    modalBodyButton.setAttribute('onclick', `report_user('${recipient_id}')`)
  })
}
}
window.addEventListener('DOMContentLoaded', modal_recipent);
  