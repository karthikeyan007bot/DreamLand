"use strict";

var serverUrl = 'http://localhost:3000';

function saveSettings() {
  var blocked_users = [];

  if (document.getElementsByClassName('block_users').length != 0) {
    document.querySelectorAll('.block_users').forEach(function (el) {
      if (el.children[0].children[1].children[1].children[0].checked == true) {
        blocked_users.push(el.id);
      }
    });
  }

  var body = {
    hide_sensitivity: document.getElementById('hide_sensitivity').checked,
    profile_visibility: document.getElementById('profile_visibility').checked,
    direct_message: RadioValueOf('direct_message'),
    blocked_users: blocked_users
  };
  fetch('/api/block', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(function () {
    var saved_toast = document.getElementById('saved_toast');
    var savedToastBootstrap = bootstrap.Toast.getOrCreateInstance(saved_toast);
    savedToastBootstrap.show();
  })["catch"](function (err) {
    return console.log(err);
  });
}

function report_user(id) {
  var body = {
    reporting_user: parseJwt(getCookie('indigotoken'))._id,
    reported_user: id,
    report: RadioValueOf('report_user_radio'),
    detail: document.getElementById('report_user_textarea').value
  };
  fetch('/api/report', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(function () {
    var toastLiveExample = document.getElementById('reported_toast');
    var toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    toastBootstrap.show();
  })["catch"](function (err) {
    return console.log(err);
  });
}

function expandParentWidth(id) {
  var parentElement = document.getElementById(id); // Replace 'parentElement' with the ID or selector of your parent element

  var childElements = parentElement.children;
  var totalWidth = 0;

  for (var i = 0; i < childElements.length; i++) {
    totalWidth += childElements[i].offsetWidth;
  }

  parentElement.style.width = totalWidth + 'px';
}

function generateBlockUser() {
  var user_id = event.target.value;
  var blocked_users = document.getElementById('blocked_users');
  fetch("api/userByUserId/".concat(user_id)).then(function (data) {
    return data.json();
  }).then(function (data) {
    var results = data.payload;

    if (document.getElementsByClassName('block_users').length != 0) {
      document.querySelectorAll('.block_users').forEach(function (el) {
        if (el.children[0].children[1].children[1].children[0].checked == false) {
          el.remove();
        }
      });
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = results[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        result = _step.value;
        var src;

        if (result.prflimg) {
          src = "https://drive.google.com/uc?export=view&id=".concat(result.prflimg);
        } else {
          src = '/images/user-account-management-logo-user-icon-11562867145a56rus2zwu.png';
        }

        var cardDiv = document.createElement('div');
        cardDiv.classList.add('card', 'text-center', 'p-2', 'block_users', 'mx-2');
        cardDiv.style.width = '450px';
        cardDiv.id = result._id;
        var cardBodyDiv = document.createElement('div');
        cardBodyDiv.classList.add('card-body', 'text-center');
        var flexDiv = document.createElement('div');
        flexDiv.classList.add('d-flex');
        var userImg = document.createElement('img');
        userImg.src = src;
        userImg.alt = '';
        userImg.classList.add('usr_img');
        var textStartDiv = document.createElement('div');
        textStartDiv.classList.add('ms-4', 'text-start');
        var userNameDiv = document.createElement('div');
        userNameDiv.classList.add('usr_name');
        userNameDiv.textContent = result.name;
        var userIdDiv = document.createElement('div');
        userIdDiv.classList.add('usr_id');
        userIdDiv.textContent = result.userId;
        textStartDiv.appendChild(userNameDiv);
        textStartDiv.appendChild(userIdDiv);
        flexDiv.appendChild(userImg);
        flexDiv.appendChild(textStartDiv);
        var actionsDiv = document.createElement('div');
        actionsDiv.classList.add('d-flex', 'mt-4');
        var viewProfileLink = document.createElement('a');
        viewProfileLink.classList.add('btn', 'btn-light');
        viewProfileLink.setAttribute('href', "profile/".concat(result._id));
        viewProfileLink.textContent = 'View Profile';
        var formCheckDiv = document.createElement('div');
        formCheckDiv.classList.add('form-check', 'form-switch', 'ms-2');
        var formCheckInput = document.createElement('input');
        formCheckInput.classList.add('form-check-input', 'block_user_check');
        formCheckInput.setAttribute('type', 'checkbox');
        formCheckInput.setAttribute('role', 'switch');
        var formCheckLabel = document.createElement('label');
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
        blocked_users.appendChild(cardDiv);
        expandParentWidth('blocked_users');
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
  });
}

function generateReportUser() {
  var user_id = event.target.value;
  var reported_users = document.getElementById('reported_users');
  fetch("api/userByUserId/".concat(user_id)).then(function (data) {
    return data.json();
  }).then(function (data) {
    var results = data.payload;

    if (document.getElementsByClassName('report_users').length != 0) {
      document.querySelectorAll('.report_users').forEach(function (el) {
        el.remove();
      });
    }

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = results[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        result = _step2.value;
        var src;

        if (result.prflimg) {
          src = "https://drive.google.com/uc?export=view&id=".concat(result.prflimg);
        } else {
          src = '/images/user-account-management-logo-user-icon-11562867145a56rus2zwu.png';
        }

        var cardDiv = document.createElement('div');
        cardDiv.classList.add('card', 'text-center', 'p-2', 'report_users', 'mx-2');
        cardDiv.style.width = '450px';
        cardDiv.id = result.userId;
        var cardBodyDiv = document.createElement('div');
        cardBodyDiv.classList.add('card-body', 'text-center');
        var flexDiv = document.createElement('div');
        flexDiv.classList.add('d-flex');
        var userImg = document.createElement('img');
        userImg.src = src;
        userImg.alt = '';
        userImg.classList.add('usr_img');
        var textStartDiv = document.createElement('div');
        textStartDiv.classList.add('ms-4', 'text-start');
        var userNameDiv = document.createElement('div');
        userNameDiv.classList.add('usr_name');
        userNameDiv.textContent = result.name;
        var userIdDiv = document.createElement('div');
        userIdDiv.classList.add('usr_id');
        userIdDiv.textContent = "@".concat(result.userId);
        textStartDiv.appendChild(userNameDiv);
        textStartDiv.appendChild(userIdDiv);
        flexDiv.appendChild(userImg);
        flexDiv.appendChild(textStartDiv);
        var actionsDiv = document.createElement('div');
        actionsDiv.classList.add('d-flex', 'mt-4');
        var viewProfileLink = document.createElement('a');
        viewProfileLink.classList.add('btn', 'btn-light');
        viewProfileLink.setAttribute('href', "profile/".concat(result._id));
        viewProfileLink.textContent = 'View Profile';
        var formCheckDiv = document.createElement('div');
        formCheckDiv.classList.add('form-check', 'form-switch', 'ms-2');
        var modal_button = document.createElement('button');
        modal_button.setAttribute('type', 'button');
        modal_button.setAttribute('data-bs-toggle', 'modal');
        modal_button.setAttribute('data-bs-target', '#report_user_modal');
        modal_button.setAttribute('data-bs-backdrop', 'static');
        modal_button.setAttribute('data-bs-report_userId', result.userId);
        modal_button.setAttribute('data-bs-report_id', result._id);
        modal_button.classList.add('btn', 'btn-light');
        modal_button.textContent = 'Report';
        formCheckDiv.appendChild(modal_button);
        actionsDiv.appendChild(viewProfileLink);
        actionsDiv.appendChild(formCheckDiv);
        cardBodyDiv.appendChild(flexDiv);
        cardBodyDiv.appendChild(actionsDiv);
        cardDiv.appendChild(cardBodyDiv);
        reported_users.appendChild(cardDiv);
        expandParentWidth('reported_users');
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
          _iterator2["return"]();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  });
}

function modal_recipent() {
  var report_user_modal = document.getElementById('report_user_modal');

  if (report_user_modal) {
    report_user_modal.addEventListener('show.bs.modal', function (event) {
      // Button that triggered the modal
      var button = event.relatedTarget; // Extract info from data-bs-* attributes

      var recipient = button.getAttribute('data-bs-report_userId');
      var recipient_id = button.getAttribute('data-bs-report_id'); // If necessary, you could initiate an Ajax request here
      // and then do the updating in a callback.
      // Update the modal's content.

      var modalBodyInput = report_user_modal.querySelector('.modal-body input');
      var modalBodyButton = report_user_modal.querySelector('.modal-body button');
      modalBodyInput.value = "Reporting ".concat(recipient);
      modalBodyButton.setAttribute('onclick', "report_user('".concat(recipient_id, "')"));
    });
  }
}

window.addEventListener('DOMContentLoaded', modal_recipent);