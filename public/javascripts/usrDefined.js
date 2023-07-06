// decodes jwt 
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    return JSON.parse(jsonPayload);
  }

  function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);
  
    var interval = seconds / 31536000;
  
    if (interval > 1) {
      return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  }
  function checkBoxValueOf(name){
    var array = [];
    document.getElementsByName(name).forEach(function check(e){if (e.checked == true){ array.push(e.value)}})
    return array
  }
  
  function tagInputsOf(id){
   return document.getElementById(id).value.split(',')
  }
  // gets cookie by value
  function getCookie(name) {
    var pair = document.cookie.split('; ').find(x => x.startsWith(name+'='));
    if (pair)
       return pair.split('=')[1]
  }
  function deleteCookie(name) {
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
  // basics //
function removeElementsByClassName(className){
    const elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
  }
  // gives the value of a radio
  function RadioValueOf(name) {
    var ele = document.getElementsByName(name);
      
    for(i = 0; i < ele.length; i++) {
        if(ele[i].checked)
        return ele[i].value
    }
  }
  function logOut(){
    deleteCookie('indigotoken');
    document.location.reload()
  }
  function formatDate(dat) {
    var date = new Date(dat)
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
  }