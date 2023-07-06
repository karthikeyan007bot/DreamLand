"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var express = require('express');

var router = express.Router();

var axios = require('axios');

var jwt = require('jsonwebtoken');

var moment = require('moment');

var server = {
  url: 'http://localhost:3000'
};

var user = function user(name, id, following, followers, prflimg) {
  _classCallCheck(this, user);

  this.name = name;
  this.id = id;
  this.following = following;
  this.followers = followers;
  this.prflimg = prflimg;
};

var fantoms = function fantoms(req, res) {
  if (req.cookies.indigotoken) {
    var decoded = jwt.verify(req.cookies.indigotoken, process.env.JWT_SECRET);
    axios.post("".concat(server.url, "/api/fantoms"), {
      decoded: decoded
    }).then(function (resp) {
      res.render('home', {
        fantoms: resp.data
      });
    });
  } else {
    res.render('signin');
  }
};

var fantom = function fantom(req, res) {
  axios.get("".concat(server.url, "/api/fantom/").concat(req.params.id)).then(function (resp) {
    axios.post("".concat(server.url, "/api/user"), {
      usrRefId: resp.data.usrRefId
    }).then(function (response) {
      res.render('fantom', {
        fantom: resp.data
      });
    });
  });
}; //  Fantom description page


var fmDl = function fmDl(req, res) {
  axios.get("".concat(server.url, "/api/fantom/detail/").concat(req.params.id)).then(function (resp) {
    axios.post("".concat(server.url, "/api/user"), {
      usrRefId: resp.data.usrRefId
    }).then(function (response) {
      res.render('fmDl', {
        fantom: resp.data,
        usrName: response.data.name,
        usrId: response.data.userId,
        prflimg: response.data.prflimg
      });
    });
  });
};

var fminiFeed = function fminiFeed(req, res) {
  if (req.cookies.indigotoken) {
    var decoded = jwt.verify(req.cookies.indigotoken, process.env.JWT_SECRET);
    axios.get("".concat(server.url, "/api/fminiFeed")).then(function (resp) {
      // to get users of each fmini who are referenced by their Id
      var usrIds = [];
      resp.data.forEach(function (fmini) {
        usrIds.push([fmini.refId, fmini._id]);
      });
      axios.post("".concat(server.url, "/api/users"), {
        usrIds: usrIds
      }).then(function (response) {
        var combined = response.data.map(function (user) {
          var matchingFmini = resp.data.find(function (fmini) {
            return fmini._id === user.itemId;
          });
          return _objectSpread({}, user, {}, matchingFmini);
        });
        axios.get("".concat(server.url, "/api/user/").concat(decoded._id)).then(function (resp) {
          // gets information about user
          var User = new user(resp.data.name, resp.data.userId, resp.data.following, resp.data.followers, resp.data.prflimg);
          res.render('home', {
            fminis: combined,
            user: User
          });
        });
      })["catch"](function (err) {
        return console.log(err);
      });
    });
  } else {
    res.render('signin');
  }
};

var profile = function profile(req, res) {
  if (req.cookies.indigotoken) {
    var decoded = jwt.verify(req.cookies.indigotoken, process.env.JWT_SECRET);
    axios.get("".concat(server.url, "/api/getProfile?id=").concat(decoded._id)).then(function (resp) {
      axios.get("".concat(server.url, "/api/user/").concat(decoded._id)).then(function (resp) {
        // gets information about user
        var User = new user(resp.data.name, resp.data.userId, resp.data.following, resp.data.followers, resp.data.prflimg);
        res.render('profile', {
          title: 'Profile',
          hdrimg: resp.data.hdrimg,
          userId: resp.data.userId,
          name: resp.data.name,
          prflimg: resp.data.prflimg,
          user: User
        });
      });
    })["catch"](function (err) {
      return console.log(err);
    });
  } else {
    res.render('signin');
  }
};

var error = function error(req, res) {
  res.render('error', {
    title: 'error'
  });
};

var annexures = function annexures(req, res) {
  axios.get("".concat(server.url, "/api/").concat(req.params.id, "/annexures")).then(function (resp) {
    var usrIds = [];
    resp.data.annexes.forEach(function (annex) {
      usrIds.push([annex.usrRefId, annex._id]);
    });
    axios.post("".concat(server.url, "/api/users"), {
      usrIds: usrIds
    }).then(function (response) {
      var combined = response.data.map(function (user) {
        var matchingReply = resp.data.annexes.find(function (annex) {
          return annex._id === user.itemId;
        });
        return _objectSpread({}, user, {}, matchingReply);
      });
      res.render('alanrep', {
        annexes: combined
      });
    })["catch"](function (err) {
      return console.log(err);
    });
  });
};

var replies = function replies(req, res) {
  axios.get("".concat(server.url, "/api/").concat(req.params.id, "/replies")).then(function (resp) {
    var usrIds = [];
    resp.data.replies.forEach(function (reply) {
      usrIds.push([reply.usrRefId, reply._id]);
    });
    axios.post("".concat(server.url, "/api/users"), {
      usrIds: usrIds
    }).then(function (response) {
      var combined = response.data.map(function (user) {
        var matchingReply = resp.data.replies.find(function (reply) {
          return reply._id === user.itemId;
        });
        return _objectSpread({}, user, {}, matchingReply);
      });
      res.render('alanrep', {
        replies: combined
      });
    })["catch"](function (err) {
      return console.log(err);
    });
  });
};

var nestedReplies = function nestedReplies(req, res) {
  axios.get("".concat(server.url, "/api/").concat(req.params.fminiId, "/").concat(req.params.parentId, "/nestedReplies")).then(function (resp) {
    if (resp.data == []) {
      res.render('alanrep', {
        nothing: 'replies'
      });
    } else {
      var usrIds = [];
      resp.data.forEach(function (reply) {
        usrIds.push([reply.usrRefId, reply._id]);
      });
      axios.post("".concat(server.url, "/api/users"), {
        usrIds: usrIds
      }).then(function (response) {
        var combined = response.data.map(function (user) {
          var matchingReply = resp.data.find(function (reply) {
            return reply._id === user.itemId;
          });
          return _objectSpread({}, user, {}, matchingReply);
        });
        res.render('alanrep', {
          replies: combined,
          replyId: req.params.replyId
        });
      })["catch"](function (err) {
        return console.error(err);
      });
    }
  });
};

var alters = function alters(req, res) {
  axios.get("".concat(server.url, "/api/").concat(req.params.id, "/alters")).then(function (resp) {
    var usrIds = [];
    resp.data.alters.forEach(function (alter) {
      usrIds.push([alter.usrRefId, alter._id]);
    });
    axios.post("".concat(server.url, "/api/users"), {
      usrIds: usrIds
    }).then(function (response) {
      var combined = response.data.map(function (user) {
        var matchingReply = resp.data.alters.find(function (alter) {
          return alter._id === user.itemId;
        });
        return _objectSpread({}, user, {}, matchingReply);
      });
      res.render('alanrep', {
        alters: combined
      });
    })["catch"](function (err) {
      return console.log(err);
    });
  });
};

var fmini = function fmini(req, res) {
  var decoded, response, re, resp, User;
  return regeneratorRuntime.async(function fmini$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          decoded = jwt.verify(req.cookies.indigotoken, process.env.JWT_SECRET);
          _context.next = 4;
          return regeneratorRuntime.awrap(axios.get("".concat(server.url, "/api/fmini/").concat(req.params.id)));

        case 4:
          response = _context.sent;
          console.log(response.data);
          _context.next = 8;
          return regeneratorRuntime.awrap(axios.get("".concat(server.url, "/api/user/").concat(response.data.refId)));

        case 8:
          re = _context.sent;
          _context.next = 11;
          return regeneratorRuntime.awrap(axios.get("".concat(server.url, "/api/user/").concat(decoded._id)));

        case 11:
          resp = _context.sent;
          User = new user(resp.data.name, resp.data.userId, resp.data.following, resp.data.followers, resp.data.prflimg);
          res.render('fmini', {
            fmini: response.data,
            user: User,
            fmini_user: re.data
          });
          _context.next = 19;
          break;

        case 16:
          _context.prev = 16;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 16]]);
};

var drmpost = function drmpost(req, res) {
  var decoded = jwt.verify(req.cookies.indigotoken, process.env.JWT_SECRET);
  axios.get("".concat(server.url, "/api/user/").concat(decoded._id)).then(function (resp) {
    // gets information about user
    var User = {
      name: resp.data.name,
      id: resp.data.userId,
      prflimg: resp.data.prflimg
    };
    console.log(User);
    res.render('dream-post', {
      user: User,
      title: 'Fantom'
    });
  });
};

var find = function find(req, res) {
  var decoded = jwt.verify(req.cookies.indigotoken, process.env.JWT_SECRET);
  axios.get("".concat(server.url, "/api/user/").concat(decoded._id)).then(function (resp) {
    // gets information about user
    var User = new user(resp.data.name, resp.data.userId, resp.data.following, resp.data.followers, resp.data.prflimg);
    console.log(User);
    res.render('find', {
      user: User
    });
  });
};

var messages = function messages(req, res) {
  res.render('messages', {
    title: 'Messages'
  });
};

var message = function message(req, res) {
  var decoded = jwt.verify(req.cookies.indigotoken, process.env.JWT_SECRET);
  axios.post("".concat(server.url, "/api/gmsg"), {
    from: decoded.userId,
    to: req.params.id
  }).then(function (resp) {
    res.render('message', {
      from: decoded.userId,
      to: req.params.id,
      name: req.params.name,
      data: resp.data
    });
  })["catch"](function (e) {
    return console.log(e);
  });
};

var notifications = function notifications(req, res) {
  res.render('notifications', {
    title: 'notifications'
  });
};

var getChapterPostPage = function getChapterPostPage(req, res) {
  var decoded, user, User;
  return regeneratorRuntime.async(function getChapterPostPage$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          decoded = jwt.verify(req.cookies.indigotoken, process.env.JWT_SECRET);
          _context2.next = 3;
          return regeneratorRuntime.awrap(axios.get("".concat(server.url, "/api/user/").concat(decoded._id)));

        case 3:
          user = _context2.sent;
          User = {
            name: user.data.name,
            usr_id: user.data.userId,
            prflimg: user.data.prflimg
          };
          res.render('chapter', {
            title: 'chapter',
            fmId: req.params.fmId,
            user: User
          });

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
};

var pmsg = function pmsg(req, res) {
  var decoded = jwt.verify(req.cookies.indigotoken, process.env.JWT_SECRET);
  axios.post("".concat(server.url, "/api/pmsg"), {
    body: req.body
  }).then(function (data) {
    return res.status(201).json(data.data);
  });
};

var gmsg = function gmsg(req, res) {
  var decoded = jwt.verify(req.cookies.indigotoken, process.env.JWT_SECRET);
  axios.post("".concat(server.url, "/api/gmsg"), {
    from: decoded.userId,
    to: req.body.id
  }).then(function (resp) {
    res.status(200).json(resp.data);
  })["catch"](function (e) {
    return console.log(e);
  });
};

var updtMsgStats = function updtMsgStats(req, res) {
  var decoded = jwt.verify(req.cookies.indigotoken, process.env.JWT_SECRET);
  axios.post("".concat(server.url, "/api/updtMsgStats"), {
    here: decoded.userId,
    there: req.body.there
  }).then(function (resp) {
    res.status(200).json('ok');
  })["catch"](function (e) {
    return console.log(e);
  });
};

var settings = function settings(req, res) {
  var decoded, user, blocked_users, User;
  return regeneratorRuntime.async(function settings$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          decoded = jwt.verify(req.cookies.indigotoken, process.env.JWT_SECRET);
          _context3.next = 4;
          return regeneratorRuntime.awrap(axios.get("".concat(server.url, "/api/user/").concat(decoded._id)));

        case 4:
          user = _context3.sent;
          _context3.next = 7;
          return regeneratorRuntime.awrap(axios.post("".concat(server.url, "/api/users2"), {
            usrIds: user.data.settings.blocked_users
          }));

        case 7:
          blocked_users = _context3.sent;
          User = {
            name: user.data.name,
            usr_id: user.data.userId,
            prflimg: user.data.prflimg,
            email: user.data.email,
            blocked_users: blocked_users.data,
            settings: user.data.settings
          };
          res.render('settings', {
            user: User
          });
          _context3.next = 15;
          break;

        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](0);
          console.log(_context3.t0);

        case 15:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

module.exports = {
  settings: settings,
  fminiFeed: fminiFeed,
  error: error,
  profile: profile,
  fmini: fmini,
  find: find,
  drmpost: drmpost,
  messages: messages,
  message: message,
  notifications: notifications,
  getChapterPostPage: getChapterPostPage,
  pmsg: pmsg,
  gmsg: gmsg,
  updtMsgStats: updtMsgStats,
  annexures: annexures,
  replies: replies,
  alters: alters,
  nestedReplies: nestedReplies,
  fantoms: fantoms,
  fmDl: fmDl,
  fantom: fantom
};