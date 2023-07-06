"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var mongoose = require('mongoose');

var jwt = require('jsonwebtoken');

var Fmini = mongoose.model('Fmini');
var Message = mongoose.model('Message');
var Profile = mongoose.model('Profile');
var Fantom = mongoose.model('Fantom');
var Report = mongoose.model('Report');

var fmini = function fmini(req, res) {
  var fmini, profile, session;
  return regeneratorRuntime.async(function fmini$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          fmini = new Fmini();
          _context2.next = 3;
          return regeneratorRuntime.awrap(Profile.findById(req.body.refId));

        case 3:
          profile = _context2.sent;
          _context2.next = 6;
          return regeneratorRuntime.awrap(mongoose.startSession());

        case 6:
          session = _context2.sent;
          _context2.prev = 7;
          _context2.next = 10;
          return regeneratorRuntime.awrap(session.withTransaction(function _callee() {
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    fmini._id = new mongoose.Types.ObjectId();
                    fmini.userName = req.body.userName;
                    fmini.userId = req.body.userId;
                    fmini.refId = req.body.refId;
                    fmini.media = req.body.media;
                    fmini.body = req.body.body;
                    fmini.mood = req.body.mood;
                    fmini.tags = req.body.tags;
                    fmini.catagory = req.body.catagory;
                    fmini.settings = req.body.settings;
                    fmini.save(function (err) {
                      if (err) {
                        console.log(err);
                      } else {
                        res.status(201).json('ok');
                      }
                    });
                    profile.fanotmMini.push(fmini._id);

                  case 12:
                  case "end":
                    return _context.stop();
                }
              }
            });
          }));

        case 10:
          _context2.next = 14;
          break;

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](7);

        case 14:
          _context2.prev = 14;
          return _context2.finish(14);

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[7, 12, 14, 16]]);
};

var pmsg = function pmsg(req, res) {
  var message = new Message();
  message.message = req.body.body.message;
  message.from = req.body.body.from;
  message.to = req.body.body.to;
  message.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.status(201).json(message);
    }
  });
};

var gmsg = function gmsg(req, res) {
  Message.find({
    $or: [{
      $and: [{
        from: req.body.from
      }, {
        to: req.body.to
      }]
    }, {
      $and: [{
        from: req.body.to
      }, {
        to: req.body.from
      }]
    }]
  }).then(function (m) {
    return res.status(200).json(m);
  });
};

var getUser = function getUser(req, res) {
  var user;
  return regeneratorRuntime.async(function getUser$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(Profile.findById(req.params.usrRefId));

        case 2:
          user = _context3.sent;
          res.status(200).json(user);

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
};

var users = function users(req, res) {
  var payload, search;
  return regeneratorRuntime.async(function users$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          payload = req.params.userId;
          _context4.next = 3;
          return regeneratorRuntime.awrap(Profile.find({
            userId: {
              $regex: new RegExp('^' + payload + '.*', 'i')
            }
          }).select({
            name: 1,
            userId: 1,
            prflimg: 1
          }).exec());

        case 3:
          search = _context4.sent;
          results = search.slice(0, 10);
          res.send({
            payload: results
          });

        case 6:
        case "end":
          return _context4.stop();
      }
    }
  });
};

var updtMsgStats = function updtMsgStats(req, res) {
  return regeneratorRuntime.async(function updtMsgStats$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(Message.updateMany({
            $and: [{
              from: req.body.there
            }, {
              to: req.body.here
            }]
          }, {
            $set: {
              status: 'seen'
            }
          }).then(function () {
            return res.status(200).json('ok');
          })["catch"](function (err) {
            return console.log(err);
          }));

        case 2:
        case "end":
          return _context5.stop();
      }
    }
  });
};

var dltmsg = function dltmsg(req, res) {
  Message.findByIdAndDelete(req.body.id).then(function () {
    return res.status(200).json('deleted');
  })["catch"](function (e) {
    return console.log(e);
  });
};

var chapterPost = function chapterPost(req, res) {
  var fantom;
  return regeneratorRuntime.async(function chapterPost$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(Fantom.findById(req.params.fmId));

        case 2:
          fantom = _context6.sent;
          fantom.chapters.title = req.body.title, fantom.chapters.chapter = req.body.chapter;
          fantom.save(function (err) {
            if (err) {
              console.log(err);
            } else {
              res.status(201).json('ok');
            }
          });

        case 5:
        case "end":
          return _context6.stop();
      }
    }
  });
};

var fantom = function fantom(req, res) {
  var fantom = new Fantom();
  fantom._id = new mongoose.Types.ObjectId(), fantom.userId = req.body.userId, fantom.userName = req.body.userName, fantom.title = req.body.title, fantom.desc = req.body.desc, fantom.tags = req.body.tags, fantom.catagory = req.body.catagory, fantom.prota = req.body.prota, fantom.anta = req.body.anta, fantom.deuta = req.body.deuta, fantom.tert = req.body.tert, fantom.feelings = req.body.feelings, fantom.age_rating = req.body.age_rating, fantom.who_can_see = req.body.who_can_see, fantom.post_as = req.body.post_as, fantom.backGround = req.body.backGround, fantom.cover = req.body.cover, fantom.usrRefId = req.body.usrRefId;
  fantom.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.status(201).json(fantom._id.toString());
    }
  });
};

function findTargetReply(target, parentId) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = target[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var item = _step.value;

      if (item._id.toString() == parentId || item._id == parentId) {
        return item;
      } else {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = item.replies[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var reply = _step2.value;

            if (reply._id == parentId) {
              return reply;
            } else if (reply.replies && reply.replies.length) {
              var foundReply = findTargetReply(reply.replies, parentId);

              if (foundReply) {
                return foundReply;
              }
            }
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
      }
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

  return null;
}

var getRxns = function getRxns(req, res) {
  var fmini, parentId, parent, usrRefIds;
  return regeneratorRuntime.async(function getRxns$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return regeneratorRuntime.awrap(Fmini.findOne({
            _id: req.params.fminiId
          }));

        case 2:
          fmini = _context7.sent;
          parentId = req.params.parentId;

          if (req.params.fminiId == req.params.parentId) {
            parent = fmini;
          } else if (fmini.replies.id(parentId)) {
            parent = fmini.replies.id(parentId);
          } else if (fmini.annexes.id(parentId)) {
            parent = fmini.annexes.id(parentId);
          } else if (fmini.alters.id(parentId)) {
            alters = fmini.alters.id(parentId);
          } else {
            parent = findTargetReply(fmini.replies, parentId);
          }

          if (parent == undefined) {
            parent = findTargetReply(fmini.annexes, parentId);
          }

          if (parent == undefined) {
            parent = findTargetReply(fmini.alters, parentId);
          }

          console.log(parent.reactions);
          usrRefIds = parent.reactions.map(function (reaction) {
            return reaction.usrRefId;
          });
          _context7.next = 11;
          return regeneratorRuntime.awrap(Profile.find({
            _id: {
              $in: usrRefIds
            }
          }, {
            name: 1,
            userId: 1,
            prflimg: 1
          }).then(function (users) {
            var userMap = new Map();
            users.forEach(function (user) {
              userMap.set(user._id.toString(), user);
            });
            var combined = parent.reactions.map(function (reaction) {
              var user = userMap.get(reaction.usrRefId);
              return _objectSpread({}, reaction.toObject(), {
                user: user.toObject()
              });
            });
            res.status(200).json(combined);
          }));

        case 11:
        case "end":
          return _context7.stop();
      }
    }
  });
};

function postRxn(req, res) {
  var fmini, profile, parentId, usrRefId, parent, reactionData, session;
  return regeneratorRuntime.async(function postRxn$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.next = 2;
          return regeneratorRuntime.awrap(Fmini.findOne({
            _id: req.body.fminiId
          }));

        case 2:
          fmini = _context9.sent;
          _context9.next = 5;
          return regeneratorRuntime.awrap(Profile.findById(req.body.usrRefId));

        case 5:
          profile = _context9.sent;
          parentId = req.body.parentId;
          usrRefId = req.body.usrRefId;
          reactionData = {
            _id: new mongoose.Types.ObjectId(),
            reaction: req.body.rxn,
            usrRefId: req.body.usrRefId,
            parentId: req.body.parentId
          };

          if (req.body.fminiRefId == req.body.parentId) {
            parent = fmini;
            console.log('parent:', parent);
          } else if (fmini.replies.id(parentId)) {
            parent = fmini.replies.id(parentId);
          } else if (fmini.annexes.id(parentId)) {
            parent = fmini.annexes.id(parentId);
          } else if (fmini.alters.id(parentId)) {
            alters = fmini.alters.id(parentId);
          } else {
            parent = findTargetReply(fmini.replies, parentId);
          }

          if (parent == undefined) {
            parent = findTargetReply(fmini.annexes, parentId);
          }

          if (parent == undefined) {
            parent = findTargetReply(fmini.alters, parentId);
          }

          _context9.next = 14;
          return regeneratorRuntime.awrap(mongoose.startSession());

        case 14:
          session = _context9.sent;
          _context9.prev = 15;
          console.log(parent);
          _context9.next = 19;
          return regeneratorRuntime.awrap(session.withTransaction(function _callee2() {
            var _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, reaction;

            return regeneratorRuntime.async(function _callee2$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    if (!(parent.reactions && parent.reactions.length)) {
                      _context8.next = 41;
                      break;
                    }

                    // reactions exists
                    _iteratorNormalCompletion3 = true;
                    _didIteratorError3 = false;
                    _iteratorError3 = undefined;
                    _context8.prev = 4;
                    _iterator3 = parent.reactions[Symbol.iterator]();

                  case 6:
                    if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                      _context8.next = 25;
                      break;
                    }

                    reaction = _step3.value;

                    if (!(reaction.usrRefId == usrRefId)) {
                      _context8.next = 15;
                      break;
                    }

                    // user already has reaction
                    reaction.reaction = req.body.rxn;
                    console.log('reaction updated');
                    _context8.next = 13;
                    return regeneratorRuntime.awrap(fmini.save());

                  case 13:
                    _context8.next = 22;
                    break;

                  case 15:
                    parent.reactions.push(reactionData);
                    profile.reactions.push(reactionData._id);
                    console.log('added new reaction');
                    _context8.next = 20;
                    return regeneratorRuntime.awrap(fmini.save());

                  case 20:
                    _context8.next = 22;
                    return regeneratorRuntime.awrap(profile.save());

                  case 22:
                    _iteratorNormalCompletion3 = true;
                    _context8.next = 6;
                    break;

                  case 25:
                    _context8.next = 31;
                    break;

                  case 27:
                    _context8.prev = 27;
                    _context8.t0 = _context8["catch"](4);
                    _didIteratorError3 = true;
                    _iteratorError3 = _context8.t0;

                  case 31:
                    _context8.prev = 31;
                    _context8.prev = 32;

                    if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
                      _iterator3["return"]();
                    }

                  case 34:
                    _context8.prev = 34;

                    if (!_didIteratorError3) {
                      _context8.next = 37;
                      break;
                    }

                    throw _iteratorError3;

                  case 37:
                    return _context8.finish(34);

                  case 38:
                    return _context8.finish(31);

                  case 39:
                    _context8.next = 48;
                    break;

                  case 41:
                    // new reaction
                    parent.reactions.push(reactionData);
                    profile.reactions.push(reactionData._id);
                    console.log('added new reaction');
                    _context8.next = 46;
                    return regeneratorRuntime.awrap(fmini.save());

                  case 46:
                    _context8.next = 48;
                    return regeneratorRuntime.awrap(profile.save());

                  case 48:
                  case "end":
                    return _context8.stop();
                }
              }
            }, null, null, [[4, 27, 31, 39], [32,, 34, 38]]);
          }));

        case 19:
          _context9.next = 24;
          break;

        case 21:
          _context9.prev = 21;
          _context9.t0 = _context9["catch"](15);
          console.log(_context9.t0);

        case 24:
          _context9.prev = 24;
          session.endSession();
          return _context9.finish(24);

        case 27:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[15, 21, 24, 27]]);
}

var postFminiTarget = function postFminiTarget(req, res) {
  var fmini, profile, media, usrTarget, session;
  return regeneratorRuntime.async(function postFminiTarget$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          console.log(req.body);
          _context11.next = 3;
          return regeneratorRuntime.awrap(Fmini.findOne({
            _id: req.body.fminiId
          }));

        case 3:
          fmini = _context11.sent;
          _context11.next = 6;
          return regeneratorRuntime.awrap(Profile.findById(req.body.usrRefId));

        case 6:
          profile = _context11.sent;

          if (req.body.media) {
            media = req.body.media;
          } else {
            media = undefined;
          }

          _context11.t0 = req.body.target;
          _context11.next = _context11.t0 === 'annex' ? 11 : _context11.t0 === 'reply' ? 14 : _context11.t0 === 'alter' ? 17 : 20;
          break;

        case 11:
          target = fmini.annexes;
          usrTarget = profile.annexes;
          return _context11.abrupt("break", 22);

        case 14:
          target = fmini.replies;
          usrTarget = profile.replies;
          return _context11.abrupt("break", 22);

        case 17:
          target = fmini.alters;
          usrTarget = profile.alters;
          return _context11.abrupt("break", 22);

        case 20:
          console.log('something went wrong');
          return _context11.abrupt("break", 22);

        case 22:
          _context11.next = 24;
          return regeneratorRuntime.awrap(mongoose.startSession());

        case 24:
          session = _context11.sent;
          _context11.prev = 25;
          _context11.next = 28;
          return regeneratorRuntime.awrap(session.withTransaction(function _callee3() {
            var obj, objId;
            return regeneratorRuntime.async(function _callee3$(_context10) {
              while (1) {
                switch (_context10.prev = _context10.next) {
                  case 0:
                    obj = {
                      _id: new mongoose.Types.ObjectId(),
                      body: req.body.body,
                      media: media,
                      usrRefId: req.body.usrRefId,
                      fminiRefId: req.body.fminiId
                    };
                    target.push(obj);
                    _context10.next = 4;
                    return regeneratorRuntime.awrap(fmini.save());

                  case 4:
                    objId = obj._id.toString();
                    usrTarget.push(objId);
                    _context10.next = 8;
                    return regeneratorRuntime.awrap(profile.save());

                  case 8:
                  case "end":
                    return _context10.stop();
                }
              }
            });
          }));

        case 28:
          res.status(200).json('done');
          console.log('Transaction committed successfully');
          _context11.next = 36;
          break;

        case 32:
          _context11.prev = 32;
          _context11.t1 = _context11["catch"](25);
          console.error('Transaction aborted:', error);
          res.status(500).json('Error');

        case 36:
          _context11.prev = 36;
          session.endSession();
          return _context11.finish(36);

        case 39:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[25, 32, 36, 39]]);
};

var postCommonReply = function postCommonReply(req, res) {
  var session, fminiId, fmini, parentId, parent;
  return regeneratorRuntime.async(function postCommonReply$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.next = 2;
          return regeneratorRuntime.awrap(mongoose.startSession());

        case 2:
          session = _context13.sent;
          fminiId = req.body.fminiRefId;
          _context13.next = 6;
          return regeneratorRuntime.awrap(Fmini.findById(fminiId).session(session));

        case 6:
          fmini = _context13.sent;
          parentId = req.body.parentId;

          if (fmini.replies.id(parentId)) {
            parent = fmini.replies.id(parentId);
          } else if (fmini.annexes.id(parentId)) {
            parent = fmini.annexes.id(parentId);
          } else if (fmini.alters.id(parentId)) {
            parent = fmini.alters.id(parentId);
          } else {
            parent = findTargetReply(fmini.replies, parentId);
          }

          if (parent == undefined) {
            parent = findTargetReply(fmini.annexes, parentId);
            console.log('annex parent:', parent);
          }

          if (parent == undefined) {
            parent = findTargetReply(fmini.alters, parentId);
            console.log('parent : ', parent);
          }

          _context13.prev = 11;
          _context13.next = 14;
          return regeneratorRuntime.awrap(session.withTransaction(function _callee4() {
            var newReply, profile, newReplyId;
            return regeneratorRuntime.async(function _callee4$(_context12) {
              while (1) {
                switch (_context12.prev = _context12.next) {
                  case 0:
                    newReply = {
                      _id: new mongoose.Types.ObjectId(),
                      body: req.body.reply,
                      media: req.body.media,
                      usrRefId: req.body.refId,
                      fminiRefId: req.body.fminiRefId
                    };
                    parent.replies.push(newReply);
                    _context12.next = 4;
                    return regeneratorRuntime.awrap(fmini.save());

                  case 4:
                    _context12.next = 6;
                    return regeneratorRuntime.awrap(Profile.findOne({
                      userRefId: req.body.refId
                    }).session(session));

                  case 6:
                    profile = _context12.sent;
                    newReplyId = newReply._id.toString();
                    profile.replies.push(newReplyId);
                    _context12.next = 11;
                    return regeneratorRuntime.awrap(profile.save());

                  case 11:
                    res.status(200).json(newReply);

                  case 12:
                  case "end":
                    return _context12.stop();
                }
              }
            });
          }));

        case 14:
          console.log('Transaction successful');
          _context13.next = 21;
          break;

        case 17:
          _context13.prev = 17;
          _context13.t0 = _context13["catch"](11);
          console.log('Transaction aborted:', _context13.t0);
          res.status(500).send('Transaction aborted');

        case 21:
          _context13.prev = 21;
          session.endSession();
          return _context13.finish(21);

        case 24:
        case "end":
          return _context13.stop();
      }
    }
  }, null, null, [[11, 17, 21, 24]]);
};

var getNestedReply = function getNestedReply(req, res) {
  var fmini, parentId, parent, nestedReplies;
  return regeneratorRuntime.async(function getNestedReply$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _context14.next = 2;
          return regeneratorRuntime.awrap(Fmini.findById(req.params.fminiId));

        case 2:
          fmini = _context14.sent;
          parentId = req.params.parentId;

          if (!fmini) {
            console.log('no fmini found with given id');
          }

          try {
            if (fmini.replies.id(parentId)) {
              parent = fmini.replies.id(parentId);
            } else if (fmini.annexes.id(parentId)) {
              parent = fmini.annexes.id(parentId);
            } else if (fmini.alters.id(parentId)) {
              parent = fmini.alters.id(parentId);
            } else {
              parent = findTargetReply(fmini.replies, parentId);
            }

            if (parent == undefined) {
              parent = findTargetReply(fmini.annexes, parentId);
            }

            if (parent == undefined) {
              parent = findTargetReply(fmini.alters, parentId);
            }

            if (!parent) {
              console.log('no parent element found with given id');
            }

            nestedReplies = parent.replies;
            res.status(200).json(nestedReplies);
          } catch (error) {
            console.error(error);
          }

        case 6:
        case "end":
          return _context14.stop();
      }
    }
  });
};

var fminiFeed = function fminiFeed(req, res) {
  return regeneratorRuntime.async(function fminiFeed$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _context15.next = 2;
          return regeneratorRuntime.awrap(Fmini.find().then(function (resp) {
            res.json(resp).status(200);
          }));

        case 2:
        case "end":
          return _context15.stop();
      }
    }
  });
};

var getFmini = function getFmini(req, res) {
  Fmini.findById(req.params.id).select({
    tags: 1,
    refId: 1,
    media: 1,
    body: 1,
    mood: 1,
    catagory: 1,
    userId: 1,
    userName: 1,
    reactions: 1
  }).exec(function (err, fmini) {
    res.status(200).json(fmini);
  });
};

var getUsers = function getUsers(req, res) {
  var _users;

  return regeneratorRuntime.async(function getUsers$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          _context17.prev = 0;
          _context17.next = 3;
          return regeneratorRuntime.awrap(Promise.all(req.body.usrIds.map(function _callee5(id) {
            var user;
            return regeneratorRuntime.async(function _callee5$(_context16) {
              while (1) {
                switch (_context16.prev = _context16.next) {
                  case 0:
                    _context16.next = 2;
                    return regeneratorRuntime.awrap(Profile.findById(id[0]));

                  case 2:
                    user = _context16.sent;
                    return _context16.abrupt("return", {
                      user_id: user._id,
                      userId: user.userId,
                      name: user.name,
                      prflimg: user.prflimg,
                      itemId: id[1]
                    });

                  case 4:
                  case "end":
                    return _context16.stop();
                }
              }
            });
          })));

        case 3:
          _users = _context17.sent;
          res.status(200).json(_users);
          _context17.next = 10;
          break;

        case 7:
          _context17.prev = 7;
          _context17.t0 = _context17["catch"](0);
          console.error(_context17.t0);

        case 10:
        case "end":
          return _context17.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var getUsers2 = function getUsers2(req, res) {
  var _users2;

  return regeneratorRuntime.async(function getUsers2$(_context19) {
    while (1) {
      switch (_context19.prev = _context19.next) {
        case 0:
          _context19.prev = 0;
          _context19.next = 3;
          return regeneratorRuntime.awrap(Promise.all(req.body.usrIds.map(function _callee6(id) {
            var user;
            return regeneratorRuntime.async(function _callee6$(_context18) {
              while (1) {
                switch (_context18.prev = _context18.next) {
                  case 0:
                    _context18.next = 2;
                    return regeneratorRuntime.awrap(Profile.findById(id));

                  case 2:
                    user = _context18.sent;
                    return _context18.abrupt("return", {
                      user_id: user._id,
                      userId: user.userId,
                      name: user.name,
                      prflimg: user.prflimg
                    });

                  case 4:
                  case "end":
                    return _context18.stop();
                }
              }
            });
          })));

        case 3:
          _users2 = _context19.sent;
          res.status(200).json(_users2);
          _context19.next = 10;
          break;

        case 7:
          _context19.prev = 7;
          _context19.t0 = _context19["catch"](0);
          console.error(_context19.t0);

        case 10:
        case "end":
          return _context19.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var fantoms = function fantoms(req, res) {
  Fantom.find({
    "who_can_see": "anyone"
  }, '-body -whoCanSee', function (err, fantoms) {
    res.status(200).json(fantoms);
  });
};

var getFantom = function getFantom(req, res) {
  Fantom.findById(req.params.id, 'body reply reactions title', function (err, fantom) {
    res.status(200).json(fantom);
  });
};

var fmDl = function fmDl(req, res) {
  Fantom.findById(req.params.id, '-body', function (err, fantom) {
    res.status(200).json(fantom);
  });
};

var fmsDl = function fmsDl(req, res) {
  Fantom.find({
    usrRefId: req.params.id
  }, 'title desc cover', function (err, fantoms) {
    res.status(200).json(fantoms);
  });
};

var fminisDl = function fminisDl(req, res) {
  Fmini.find({
    refId: req.params.id
  }, {
    _id: 0,
    body: 1,
    media: 1
  }, function (err, fminis) {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json(fminis);
    }
  });
};

var allReplies = [];

var getAllReplies = function getAllReplies() {
  var fminis, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, fm, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, reply, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, annex, _iteratorNormalCompletion7, _didIteratorError7, _iteratorError7, _iterator7, _step7, alter;

  return regeneratorRuntime.async(function getAllReplies$(_context20) {
    while (1) {
      switch (_context20.prev = _context20.next) {
        case 0:
          _context20.prev = 0;
          _context20.next = 3;
          return regeneratorRuntime.awrap(Fmini.find({}));

        case 3:
          fminis = _context20.sent;
          _iteratorNormalCompletion4 = true;
          _didIteratorError4 = false;
          _iteratorError4 = undefined;
          _context20.prev = 7;
          _iterator4 = fminis[Symbol.iterator]();

        case 9:
          if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
            _context20.next = 71;
            break;
          }

          fm = _step4.value;
          _iteratorNormalCompletion5 = true;
          _didIteratorError5 = false;
          _iteratorError5 = undefined;
          _context20.prev = 14;

          for (_iterator5 = fm.replies[Symbol.iterator](); !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            reply = _step5.value;
            allReplies.push(reply);

            if (reply.replies) {
              findSubReply(reply);
            }
          }

          _context20.next = 22;
          break;

        case 18:
          _context20.prev = 18;
          _context20.t0 = _context20["catch"](14);
          _didIteratorError5 = true;
          _iteratorError5 = _context20.t0;

        case 22:
          _context20.prev = 22;
          _context20.prev = 23;

          if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
            _iterator5["return"]();
          }

        case 25:
          _context20.prev = 25;

          if (!_didIteratorError5) {
            _context20.next = 28;
            break;
          }

          throw _iteratorError5;

        case 28:
          return _context20.finish(25);

        case 29:
          return _context20.finish(22);

        case 30:
          _iteratorNormalCompletion6 = true;
          _didIteratorError6 = false;
          _iteratorError6 = undefined;
          _context20.prev = 33;

          for (_iterator6 = fm.annexes[Symbol.iterator](); !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
            annex = _step6.value;

            if (annex.replies && annex.replies.length) {
              findSubReply(annex);
            }
          }

          _context20.next = 41;
          break;

        case 37:
          _context20.prev = 37;
          _context20.t1 = _context20["catch"](33);
          _didIteratorError6 = true;
          _iteratorError6 = _context20.t1;

        case 41:
          _context20.prev = 41;
          _context20.prev = 42;

          if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {
            _iterator6["return"]();
          }

        case 44:
          _context20.prev = 44;

          if (!_didIteratorError6) {
            _context20.next = 47;
            break;
          }

          throw _iteratorError6;

        case 47:
          return _context20.finish(44);

        case 48:
          return _context20.finish(41);

        case 49:
          _iteratorNormalCompletion7 = true;
          _didIteratorError7 = false;
          _iteratorError7 = undefined;
          _context20.prev = 52;

          for (_iterator7 = fm.alters[Symbol.iterator](); !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
            alter = _step7.value;

            if (alter.replies && alter.replies.length) {
              findSubReply(alter);
            }
          }

          _context20.next = 60;
          break;

        case 56:
          _context20.prev = 56;
          _context20.t2 = _context20["catch"](52);
          _didIteratorError7 = true;
          _iteratorError7 = _context20.t2;

        case 60:
          _context20.prev = 60;
          _context20.prev = 61;

          if (!_iteratorNormalCompletion7 && _iterator7["return"] != null) {
            _iterator7["return"]();
          }

        case 63:
          _context20.prev = 63;

          if (!_didIteratorError7) {
            _context20.next = 66;
            break;
          }

          throw _iteratorError7;

        case 66:
          return _context20.finish(63);

        case 67:
          return _context20.finish(60);

        case 68:
          _iteratorNormalCompletion4 = true;
          _context20.next = 9;
          break;

        case 71:
          _context20.next = 77;
          break;

        case 73:
          _context20.prev = 73;
          _context20.t3 = _context20["catch"](7);
          _didIteratorError4 = true;
          _iteratorError4 = _context20.t3;

        case 77:
          _context20.prev = 77;
          _context20.prev = 78;

          if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
            _iterator4["return"]();
          }

        case 80:
          _context20.prev = 80;

          if (!_didIteratorError4) {
            _context20.next = 83;
            break;
          }

          throw _iteratorError4;

        case 83:
          return _context20.finish(80);

        case 84:
          return _context20.finish(77);

        case 85:
          return _context20.abrupt("return", allReplies);

        case 88:
          _context20.prev = 88;
          _context20.t4 = _context20["catch"](0);
          console.error(_context20.t4);

        case 91:
        case "end":
          return _context20.stop();
      }
    }
  }, null, null, [[0, 88], [7, 73, 77, 85], [14, 18, 22, 30], [23,, 25, 29], [33, 37, 41, 49], [42,, 44, 48], [52, 56, 60, 68], [61,, 63, 67], [78,, 80, 84]]);
};

function findSubReply(targetReply) {
  var _iteratorNormalCompletion8 = true;
  var _didIteratorError8 = false;
  var _iteratorError8 = undefined;

  try {
    for (var _iterator8 = targetReply.replies[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
      var reply = _step8.value;
      allReplies.push(reply);

      if (reply.replies) {
        findSubReply(reply);
      }
    }
  } catch (err) {
    _didIteratorError8 = true;
    _iteratorError8 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion8 && _iterator8["return"] != null) {
        _iterator8["return"]();
      }
    } finally {
      if (_didIteratorError8) {
        throw _iteratorError8;
      }
    }
  }
}

var usrReplies = function usrReplies(req, res) {
  var userId, _allReplies, userReplies;

  return regeneratorRuntime.async(function usrReplies$(_context21) {
    while (1) {
      switch (_context21.prev = _context21.next) {
        case 0:
          userId = req.params.id;
          _context21.prev = 1;
          _context21.next = 4;
          return regeneratorRuntime.awrap(getAllReplies());

        case 4:
          _allReplies = _context21.sent;
          userReplies = _allReplies.filter(function (reply) {
            return reply.usrRefId === userId;
          });
          res.status(200).json(userReplies);
          _context21.next = 13;
          break;

        case 9:
          _context21.prev = 9;
          _context21.t0 = _context21["catch"](1);
          console.error(_context21.t0);
          res.status(500).send('An error occurred while fetching replies.');

        case 13:
        case "end":
          return _context21.stop();
      }
    }
  }, null, null, [[1, 9]]);
};

var usrAnnexes = function usrAnnexes(req, res) {
  var usrAnnexes, fm, _iteratorNormalCompletion9, _didIteratorError9, _iteratorError9, _iterator9, _step9, fmini, _iteratorNormalCompletion10, _didIteratorError10, _iteratorError10, _iterator10, _step10, annex;

  return regeneratorRuntime.async(function usrAnnexes$(_context22) {
    while (1) {
      switch (_context22.prev = _context22.next) {
        case 0:
          usrAnnexes = [];
          _context22.next = 3;
          return regeneratorRuntime.awrap(Fmini.find({}));

        case 3:
          fm = _context22.sent;
          _iteratorNormalCompletion9 = true;
          _didIteratorError9 = false;
          _iteratorError9 = undefined;
          _context22.prev = 7;
          _iterator9 = fm[Symbol.iterator]();

        case 9:
          if (_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done) {
            _context22.next = 33;
            break;
          }

          fmini = _step9.value;
          _iteratorNormalCompletion10 = true;
          _didIteratorError10 = false;
          _iteratorError10 = undefined;
          _context22.prev = 14;

          for (_iterator10 = fmini.annexes[Symbol.iterator](); !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
            annex = _step10.value;

            if (annex.usrRefId = req.params.id) {
              usrAnnexes.push(annex);
            }
          }

          _context22.next = 22;
          break;

        case 18:
          _context22.prev = 18;
          _context22.t0 = _context22["catch"](14);
          _didIteratorError10 = true;
          _iteratorError10 = _context22.t0;

        case 22:
          _context22.prev = 22;
          _context22.prev = 23;

          if (!_iteratorNormalCompletion10 && _iterator10["return"] != null) {
            _iterator10["return"]();
          }

        case 25:
          _context22.prev = 25;

          if (!_didIteratorError10) {
            _context22.next = 28;
            break;
          }

          throw _iteratorError10;

        case 28:
          return _context22.finish(25);

        case 29:
          return _context22.finish(22);

        case 30:
          _iteratorNormalCompletion9 = true;
          _context22.next = 9;
          break;

        case 33:
          _context22.next = 39;
          break;

        case 35:
          _context22.prev = 35;
          _context22.t1 = _context22["catch"](7);
          _didIteratorError9 = true;
          _iteratorError9 = _context22.t1;

        case 39:
          _context22.prev = 39;
          _context22.prev = 40;

          if (!_iteratorNormalCompletion9 && _iterator9["return"] != null) {
            _iterator9["return"]();
          }

        case 42:
          _context22.prev = 42;

          if (!_didIteratorError9) {
            _context22.next = 45;
            break;
          }

          throw _iteratorError9;

        case 45:
          return _context22.finish(42);

        case 46:
          return _context22.finish(39);

        case 47:
          res.status(200).json(usrAnnexes);

        case 48:
        case "end":
          return _context22.stop();
      }
    }
  }, null, null, [[7, 35, 39, 47], [14, 18, 22, 30], [23,, 25, 29], [40,, 42, 46]]);
};

var usrAlters = function usrAlters(req, res) {
  var usrAlters, fm, _iteratorNormalCompletion11, _didIteratorError11, _iteratorError11, _iterator11, _step11, fmini, _iteratorNormalCompletion12, _didIteratorError12, _iteratorError12, _iterator12, _step12, alter;

  return regeneratorRuntime.async(function usrAlters$(_context23) {
    while (1) {
      switch (_context23.prev = _context23.next) {
        case 0:
          usrAlters = [];
          _context23.next = 3;
          return regeneratorRuntime.awrap(Fmini.find({}));

        case 3:
          fm = _context23.sent;
          _iteratorNormalCompletion11 = true;
          _didIteratorError11 = false;
          _iteratorError11 = undefined;
          _context23.prev = 7;
          _iterator11 = fm[Symbol.iterator]();

        case 9:
          if (_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done) {
            _context23.next = 33;
            break;
          }

          fmini = _step11.value;
          _iteratorNormalCompletion12 = true;
          _didIteratorError12 = false;
          _iteratorError12 = undefined;
          _context23.prev = 14;

          for (_iterator12 = fmini.alters[Symbol.iterator](); !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
            alter = _step12.value;

            if (alter.usrRefId = req.params.id) {
              usrAlters.push(alter);
            }
          }

          _context23.next = 22;
          break;

        case 18:
          _context23.prev = 18;
          _context23.t0 = _context23["catch"](14);
          _didIteratorError12 = true;
          _iteratorError12 = _context23.t0;

        case 22:
          _context23.prev = 22;
          _context23.prev = 23;

          if (!_iteratorNormalCompletion12 && _iterator12["return"] != null) {
            _iterator12["return"]();
          }

        case 25:
          _context23.prev = 25;

          if (!_didIteratorError12) {
            _context23.next = 28;
            break;
          }

          throw _iteratorError12;

        case 28:
          return _context23.finish(25);

        case 29:
          return _context23.finish(22);

        case 30:
          _iteratorNormalCompletion11 = true;
          _context23.next = 9;
          break;

        case 33:
          _context23.next = 39;
          break;

        case 35:
          _context23.prev = 35;
          _context23.t1 = _context23["catch"](7);
          _didIteratorError11 = true;
          _iteratorError11 = _context23.t1;

        case 39:
          _context23.prev = 39;
          _context23.prev = 40;

          if (!_iteratorNormalCompletion11 && _iterator11["return"] != null) {
            _iterator11["return"]();
          }

        case 42:
          _context23.prev = 42;

          if (!_didIteratorError11) {
            _context23.next = 45;
            break;
          }

          throw _iteratorError11;

        case 45:
          return _context23.finish(42);

        case 46:
          return _context23.finish(39);

        case 47:
          res.status(200).json(usrAlters);

        case 48:
        case "end":
          return _context23.stop();
      }
    }
  }, null, null, [[7, 35, 39, 47], [14, 18, 22, 30], [23,, 25, 29], [40,, 42, 46]]);
};

var topUsers = function topUsers(req, res) {
  var _users3;

  return regeneratorRuntime.async(function topUsers$(_context24) {
    while (1) {
      switch (_context24.prev = _context24.next) {
        case 0:
          _context24.prev = 0;
          _context24.next = 3;
          return regeneratorRuntime.awrap(Profile.find(_defineProperty({
            followers: {
              $size: {
                $gt: 2
              }
            }
          }, "followers", {
            $nin: [req.params.id]
          })));

        case 3:
          _users3 = _context24.sent;
          res.status(200).json(_users3);
          _context24.next = 10;
          break;

        case 7:
          _context24.prev = 7;
          _context24.t0 = _context24["catch"](0);
          console.log(_context24.t0);

        case 10:
        case "end":
          return _context24.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var report = function report(req, res) {
  var report;
  return regeneratorRuntime.async(function report$(_context25) {
    while (1) {
      switch (_context25.prev = _context25.next) {
        case 0:
          report = new Report();
          report.report = req.body.report;
          report.reported_user = req.body.reported_user;
          report.reporting_user = req.body.reporting_user;
          report.detail = req.body.detail;
          report.save(function (err) {
            if (err) {
              console.log(err);
            } else {
              res.status(201).json('ok');
            }
          });

        case 6:
        case "end":
          return _context25.stop();
      }
    }
  });
};

var saveSettings = function saveSettings(req, res) {
  var decoded, profile;
  return regeneratorRuntime.async(function saveSettings$(_context26) {
    while (1) {
      switch (_context26.prev = _context26.next) {
        case 0:
          console.log(req.body.blocked_users);
          req.body.blocked_users.forEach(function (id) {
            console.log(id);
          });
          decoded = jwt.verify(req.cookies.indigotoken, process.env.JWT_SECRET);
          _context26.next = 5;
          return regeneratorRuntime.awrap(Profile.findById(decoded._id));

        case 5:
          profile = _context26.sent;
          console.log(req.body);
          profile.settings.profile_visibility = req.body.profile_visibility;
          profile.settings.direct_message = req.body.direct_message;
          profile.settings.hide_sensitivity = req.body.hide_sensitivity;
          profile.settings.blocked_users = req.body.blocked_users;
          profile.save(function (err) {
            if (err) {
              console.log(err);
            } else {
              res.status(201).json('ok');
            }
          });

        case 12:
        case "end":
          return _context26.stop();
      }
    }
  });
};

module.exports = {
  chapterPost: chapterPost,
  saveSettings: saveSettings,
  report: report,
  postFminiTarget: postFminiTarget,
  fmini: fmini,
  users: users,
  getUser: getUser,
  pmsg: pmsg,
  gmsg: gmsg,
  updtMsgStats: updtMsgStats,
  dltmsg: dltmsg,
  fantom: fantom,
  postRxn: postRxn,
  fminiFeed: fminiFeed,
  getFmini: getFmini,
  getUsers: getUsers,
  getUsers2: getUsers2,
  postCommonReply: postCommonReply,
  getNestedReply: getNestedReply,
  fantoms: fantoms,
  getFantom: getFantom,
  fmDl: fmDl,
  fmsDl: fmsDl,
  fminisDl: fminisDl,
  usrReplies: usrReplies,
  usrAnnexes: usrAnnexes,
  usrAlters: usrAlters,
  getRxns: getRxns,
  topUsers: topUsers
};