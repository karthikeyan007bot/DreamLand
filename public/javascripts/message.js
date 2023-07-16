var elements = document.getElementsByClassName('dltmsg')
// To add event listener to class elements
var dltmlsg = function(e) {
  var id = e.target.parentElement.id
  data = {
    id : e.target.parentElement.id,
  }
  fetch('https://dreamverse.vercel.app/api/dltmsg', {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(()=> document.getElementById(id).remove()).catch(e => console.log(e))
};
function deleteMsg(){
  for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener('click', dltmlsg, false);
}
}
// 
var message = document.getElementsByClassName("message");

var $messages = $('.messages-content'),
    d, h, m,
    i = 0;

$(window).load(function() {
  $messages.mCustomScrollbar();
});

function updateScrollbar() {
  $messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
    scrollInertia: 10,
    timeout: 0
  });
}


function loadRecentMsg(){
  var id = {
    id: location.href.split('recip=')[1]
  }
  fetch(`https://dreamverse.vercel.app/gmsg`, {
    method : 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body : JSON.stringify(id)
  }).then(res => res.json()).then( data => {
    removeElementsByClassName('message')
    data.forEach(el => {
      var div = document.createElement('div');
      div.id = el._id
      if(el.from == location.href.split('recip=')[1]){
        div.classList.add('message')
      div.innerHTML = `<span>${el.message}</span><a class="options" tabindex="0" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-html="true" data-bs-content="${formatDate(el.timeStamp)}</a>"><div class="material-symbols-outlined">atr </div></a>`;
    }else{
        div.classList.add('message', 'message-personal', 'new')
      div.innerHTML = `<span>${el.message}</span><a class="options" tabindex="0" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-html="true" data-bs-content="${formatDate(el.timeStamp)}</a>"><div class="material-symbols-outlined">atr </div></a><div class="material-symbols-outlined dltmsg">delete</div><div class="msg-status"><span>${el.status}</span></div>`;
    };
      document.getElementById('mCSB_1_container').append(div)
    });
      deleteMsg()
      var popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
     var popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))
    }).catch(e => console.log(e))
}
function insertMessage() {
  var timeStamp, id;
const cookie = getCookie('indigotoken')
const from = parseJwt(cookie).userId;
var q = window.location.href
const to = q.split('=')[1]
  msg = $('.message-input').val();
  const data = { 
    message  : msg,
    from : from,
    to: to,
   };
  fetch('https://dreamverse.vercel.app/pmsg', {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((resp)=> resp.json()).then( data => {
    var datee = data.timeStamp
    console.log(datee)
    $('<div class="message message-personal" id="'+data._id+'"><span>'+ msg +'</span><a class="options" tabindex="0" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-html="true" data-bs-content="'+formatDate(datee)+'</a>"><div class="material-symbols-outlined">atr</div></a><div class="material-symbols-outlined dltmsg">delete</div><div class="msg-status"><span>sent</span></div>').appendTo($('.mCSB_container')).addClass('new');
    $('.message-input').val(null);
    updateScrollbar();
    deleteMsg()
    var popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
    var popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))   
  })
  if ($.trim(msg) == '') {
    return false;
  }
}

$('.message-submit').click(function() {
  insertMessage();
});

$(window).on('keydown', function(e) {
  if (e.which == 13) {
    insertMessage();
    return false;
  }
})

function updtMsgStats(){
  data = {
    there : location.href.split('recip=')[1],
  }
  fetch('https://dreamverse.vercel.app/updtMsgStats', {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(()=> console.log('ok'))
}
updtMsgStats()
deleteMsg()

