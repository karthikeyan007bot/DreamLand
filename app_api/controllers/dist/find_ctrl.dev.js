"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var mongoose = require('mongoose');

var Fmini = mongoose.model('Fmini');
var Message = mongoose.model('Message');
var Profile = mongoose.model('Profile');
var Fantom = mongoose.model('Fantom');

var findByFantom = function findByFantom(req, res) {
  return regeneratorRuntime.async(function findByFantom$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          Fantom.find({
            title: new RegExp(req.params.value, 'i')
          }).select({
            title: 1,
            desc: 1,
            cover: 1,
            usrRefId: 1
          }).exec(function _callee2(err, fantoms) {
            var usrIds, users, combined;
            return regeneratorRuntime.async(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    usrIds = fantoms.map(function (fantom) {
                      return {
                        userId: fantom.usrRefId,
                        itemId: fantom._id,
                        fantom: fantom // Store the entire fantom object

                      };
                    });
                    _context2.next = 3;
                    return regeneratorRuntime.awrap(Promise.all(usrIds.map(function _callee(id) {
                      var user;
                      return regeneratorRuntime.async(function _callee$(_context) {
                        while (1) {
                          switch (_context.prev = _context.next) {
                            case 0:
                              _context.next = 2;
                              return regeneratorRuntime.awrap(Profile.findById(id.userId));

                            case 2:
                              user = _context.sent;
                              return _context.abrupt("return", {
                                user_id: user._id,
                                userId: user.userId,
                                name: user.name,
                                prflimg: user.prflimg,
                                itemId: id.itemId,
                                fantom: id.fantom
                              });

                            case 4:
                            case "end":
                              return _context.stop();
                          }
                        }
                      });
                    })));

                  case 3:
                    users = _context2.sent;
                    combined = users.map(function (user) {
                      var matchingFantom = usrIds.find(function (fantom) {
                        return fantom._id === user.itemId;
                      });
                      return _objectSpread({}, user, {}, matchingFantom);
                    });
                    res.status(200).json(combined);

                  case 6:
                  case "end":
                    return _context2.stop();
                }
              }
            });
          });

        case 1:
        case "end":
          return _context3.stop();
      }
    }
  });
};

var findByFmini = function findByFmini(req, res) {
  return regeneratorRuntime.async(function findByFmini$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          Fmini.find({
            body: new RegExp(req.params.value, 'i')
          }).select({
            body: 1,
            media: 1,
            refId: 1
          }).exec(function _callee4(err, fminis) {
            var usrIds, users, combined;
            return regeneratorRuntime.async(function _callee4$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    usrIds = fminis.map(function (fmini) {
                      return {
                        userId: fmini.refId,
                        itemId: fmini._id,
                        fmini: fmini // Store the entire fmini object

                      };
                    });
                    _context5.next = 3;
                    return regeneratorRuntime.awrap(Promise.all(usrIds.map(function _callee3(id) {
                      var user;
                      return regeneratorRuntime.async(function _callee3$(_context4) {
                        while (1) {
                          switch (_context4.prev = _context4.next) {
                            case 0:
                              _context4.next = 2;
                              return regeneratorRuntime.awrap(Profile.findById(id.userId));

                            case 2:
                              user = _context4.sent;
                              return _context4.abrupt("return", {
                                user_id: user._id,
                                userId: user.userId,
                                name: user.name,
                                prflimg: user.prflimg,
                                itemId: id.itemId,
                                fmini: id.fmini
                              });

                            case 4:
                            case "end":
                              return _context4.stop();
                          }
                        }
                      });
                    })));

                  case 3:
                    users = _context5.sent;
                    combined = users.map(function (user) {
                      var matchingFantom = usrIds.find(function (fmini) {
                        return fmini._id === user.itemId;
                      });
                      return _objectSpread({}, user, {}, matchingFantom);
                    });
                    res.status(200).json(combined);

                  case 6:
                  case "end":
                    return _context5.stop();
                }
              }
            });
          });

        case 1:
        case "end":
          return _context6.stop();
      }
    }
  });
};

var findByTag = function findByTag(req, res) {
  var fminis, fantoms, fmini_usrIds, fantom_usrIds, usrIds, result, users, combined;
  return regeneratorRuntime.async(function findByTag$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return regeneratorRuntime.awrap(Fmini.find({
            tags: {
              $elemMatch: {
                $regex: new RegExp(req.params.value, 'i')
              }
            }
          }).select({
            body: 1,
            media: 1,
            refId: 1,
            tags: 1
          }));

        case 2:
          fminis = _context8.sent;
          _context8.next = 5;
          return regeneratorRuntime.awrap(Fantom.find({
            tags: {
              $elemMatch: {
                $regex: new RegExp(req.params.value, 'i')
              }
            }
          }).select({
            title: 1,
            desc: 1,
            cover: 1,
            usrRefId: 1,
            tags: 1
          }));

        case 5:
          fantoms = _context8.sent;
          fmini_usrIds = fminis.map(function (fmini) {
            return {
              userId: fmini.refId,
              itemId: fmini._id,
              fmini: fmini // Store the entire fmini object

            };
          });
          fantom_usrIds = fantoms.map(function (fantom) {
            return {
              userId: fantom.usrRefId,
              itemId: fantom._id,
              fantom: fantom // Store the entire fantom object

            };
          });
          usrIds = fmini_usrIds.concat(fantom_usrIds);
          _context8.next = 11;
          return regeneratorRuntime.awrap(Promise.all(usrIds.map(function _callee5(id) {
            var user;
            return regeneratorRuntime.async(function _callee5$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    _context7.next = 2;
                    return regeneratorRuntime.awrap(Profile.findById(id.userId));

                  case 2:
                    user = _context7.sent;

                    // Find user by id
                    if (id.fmini == undefined) {
                      result = id.fantom;
                    } else if (id.fantom == undefined) {
                      result = id.fmini;
                    }

                    return _context7.abrupt("return", {
                      user_id: user._id,
                      userId: user.userId,
                      name: user.name,
                      prflimg: user.prflimg,
                      itemId: id.itemId,
                      result: result
                    });

                  case 5:
                  case "end":
                    return _context7.stop();
                }
              }
            });
          })));

        case 11:
          users = _context8.sent;
          combined = users.map(function (user) {
            var matchingFantom = usrIds.find(function (fantom) {
              return fantom._id === user.itemId;
            });
            var matchingFmini = usrIds.find(function (fmini) {
              return fmini._id === user.itemId;
            });
            return _objectSpread({}, user, {}, matchingFantom, {}, matchingFmini);
          });
          res.status(200).json(combined);

        case 14:
        case "end":
          return _context8.stop();
      }
    }
  });
};

var findByFeeling = function findByFeeling(req, res) {
  var fminis, fantoms, fmini_usrIds, fantom_usrIds, usrIds, result, users, combined;
  return regeneratorRuntime.async(function findByFeeling$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.next = 2;
          return regeneratorRuntime.awrap(Fmini.find({
            mood: req.params.value
          }).select({
            body: 1,
            media: 1,
            refId: 1,
            mood: 1
          }));

        case 2:
          fminis = _context10.sent;
          _context10.next = 5;
          return regeneratorRuntime.awrap(Fantom.find({
            feelings: {
              $elemMatch: {
                $regex: new RegExp(req.params.value, 'i')
              }
            }
          }).select({
            title: 1,
            desc: 1,
            cover: 1,
            usrRefId: 1,
            feelings: 1
          }));

        case 5:
          fantoms = _context10.sent;
          fmini_usrIds = fminis.map(function (fmini) {
            return {
              userId: fmini.refId,
              itemId: fmini._id,
              fmini: fmini // Store the entire fmini object

            };
          });
          fantom_usrIds = fantoms.map(function (fantom) {
            return {
              userId: fantom.usrRefId,
              itemId: fantom._id,
              fantom: fantom // Store the entire fantom object

            };
          });
          usrIds = fmini_usrIds.concat(fantom_usrIds);
          _context10.next = 11;
          return regeneratorRuntime.awrap(Promise.all(usrIds.map(function _callee6(id) {
            var user;
            return regeneratorRuntime.async(function _callee6$(_context9) {
              while (1) {
                switch (_context9.prev = _context9.next) {
                  case 0:
                    _context9.next = 2;
                    return regeneratorRuntime.awrap(Profile.findById(id.userId));

                  case 2:
                    user = _context9.sent;

                    // Find user by id
                    if (id.fmini == undefined) {
                      result = id.fantom;
                    } else if (id.fantom == undefined) {
                      result = id.fmini;
                    }

                    return _context9.abrupt("return", {
                      user_id: user._id,
                      userId: user.userId,
                      name: user.name,
                      prflimg: user.prflimg,
                      itemId: id.itemId,
                      result: result
                    });

                  case 5:
                  case "end":
                    return _context9.stop();
                }
              }
            });
          })));

        case 11:
          users = _context10.sent;
          combined = users.map(function (user) {
            var matchingFantom = usrIds.find(function (fantom) {
              return fantom._id === user.itemId;
            });
            var matchingFmini = usrIds.find(function (fmini) {
              return fmini._id === user.itemId;
            });
            return _objectSpread({}, user, {}, matchingFantom, {}, matchingFmini);
          });
          res.status(200).json(combined);

        case 14:
        case "end":
          return _context10.stop();
      }
    }
  });
};

var findByCatagory = function findByCatagory(req, res) {
  return regeneratorRuntime.async(function findByCatagory$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          Fantom.find({
            catagory: new RegExp(req.params.value, 'i')
          }).select({
            title: 1,
            desc: 1,
            cover: 1,
            usrRefId: 1,
            catagory: 1
          }).exec(function _callee8(err, fantoms) {
            var usrIds, users, combined;
            return regeneratorRuntime.async(function _callee8$(_context12) {
              while (1) {
                switch (_context12.prev = _context12.next) {
                  case 0:
                    usrIds = fantoms.map(function (fantom) {
                      return {
                        userId: fantom.usrRefId,
                        itemId: fantom._id,
                        fantom: fantom // Store the entire fantom object

                      };
                    });
                    _context12.next = 3;
                    return regeneratorRuntime.awrap(Promise.all(usrIds.map(function _callee7(id) {
                      var user;
                      return regeneratorRuntime.async(function _callee7$(_context11) {
                        while (1) {
                          switch (_context11.prev = _context11.next) {
                            case 0:
                              _context11.next = 2;
                              return regeneratorRuntime.awrap(Profile.findById(id.userId));

                            case 2:
                              user = _context11.sent;
                              return _context11.abrupt("return", {
                                user_id: user._id,
                                userId: user.userId,
                                name: user.name,
                                prflimg: user.prflimg,
                                itemId: id.itemId,
                                fantom: id.fantom
                              });

                            case 4:
                            case "end":
                              return _context11.stop();
                          }
                        }
                      });
                    })));

                  case 3:
                    users = _context12.sent;
                    combined = users.map(function (user) {
                      var matchingFantom = usrIds.find(function (fantom) {
                        return fantom._id === user.itemId;
                      });
                      return _objectSpread({}, user, {}, matchingFantom);
                    });
                    res.status(200).json(combined);

                  case 6:
                  case "end":
                    return _context12.stop();
                }
              }
            });
          });

        case 1:
        case "end":
          return _context13.stop();
      }
    }
  });
};

var findRecent = function findRecent(req, res) {
  var fminis, fantoms, fmini_usrIds, fantom_usrIds, usrIds, result, users, combined;
  return regeneratorRuntime.async(function findRecent$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _context15.next = 2;
          return regeneratorRuntime.awrap(Fmini.find({
            body: new RegExp(req.params.value, 'i')
          }).sort({
            createdAt: -1
          }).select({
            body: 1,
            media: 1,
            refId: 1
          }));

        case 2:
          fminis = _context15.sent;
          _context15.next = 5;
          return regeneratorRuntime.awrap(Fantom.find({
            title: new RegExp(req.params.value, 'i')
          }).sort({
            createdAt: -1
          }).select({
            title: 1,
            desc: 1,
            cover: 1,
            usrRefId: 1
          }));

        case 5:
          fantoms = _context15.sent;
          fmini_usrIds = fminis.map(function (fmini) {
            return {
              userId: fmini.refId,
              itemId: fmini._id,
              fmini: fmini // Store the entire fmini object

            };
          });
          fantom_usrIds = fantoms.map(function (fantom) {
            return {
              userId: fantom.usrRefId,
              itemId: fantom._id,
              fantom: fantom // Store the entire fantom object

            };
          });
          usrIds = fmini_usrIds.concat(fantom_usrIds);
          _context15.next = 11;
          return regeneratorRuntime.awrap(Promise.all(usrIds.map(function _callee9(id) {
            var user;
            return regeneratorRuntime.async(function _callee9$(_context14) {
              while (1) {
                switch (_context14.prev = _context14.next) {
                  case 0:
                    _context14.next = 2;
                    return regeneratorRuntime.awrap(Profile.findById(id.userId));

                  case 2:
                    user = _context14.sent;

                    // Find user by id
                    if (id.fmini == undefined) {
                      result = id.fantom;
                    } else if (id.fantom == undefined) {
                      result = id.fmini;
                    }

                    return _context14.abrupt("return", {
                      user_id: user._id,
                      userId: user.userId,
                      name: user.name,
                      prflimg: user.prflimg,
                      itemId: id.itemId,
                      result: result
                    });

                  case 5:
                  case "end":
                    return _context14.stop();
                }
              }
            });
          })));

        case 11:
          users = _context15.sent;
          combined = users.map(function (user) {
            var matchingFantom = usrIds.find(function (fantom) {
              return fantom._id === user.itemId;
            });
            var matchingFmini = usrIds.find(function (fmini) {
              return fmini._id === user.itemId;
            });
            return _objectSpread({}, user, {}, matchingFantom, {}, matchingFmini);
          });
          res.status(200).json(combined);

        case 14:
        case "end":
          return _context15.stop();
      }
    }
  });
};

var findTrending = function findTrending(req, res) {
  var fminis, fantoms, fmini_usrIds, fantom_usrIds, usrIds, result, users, combined;
  return regeneratorRuntime.async(function findTrending$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          _context17.next = 2;
          return regeneratorRuntime.awrap(Fmini.find({
            body: new RegExp(req.params.value, 'i')
          }).sort({
            "reactions.length": -1
          }).select({
            body: 1,
            media: 1,
            refId: 1
          }));

        case 2:
          fminis = _context17.sent;
          _context17.next = 5;
          return regeneratorRuntime.awrap(Fantom.find({
            title: new RegExp(req.params.value, 'i')
          }).sort({
            "reactions.length": -1
          }).select({
            title: 1,
            desc: 1,
            cover: 1,
            usrRefId: 1
          }));

        case 5:
          fantoms = _context17.sent;
          fmini_usrIds = fminis.map(function (fmini) {
            return {
              userId: fmini.refId,
              itemId: fmini._id,
              fmini: fmini // Store the entire fmini object

            };
          });
          fantom_usrIds = fantoms.map(function (fantom) {
            return {
              userId: fantom.usrRefId,
              itemId: fantom._id,
              fantom: fantom // Store the entire fantom object

            };
          });
          usrIds = fmini_usrIds.concat(fantom_usrIds);
          _context17.next = 11;
          return regeneratorRuntime.awrap(Promise.all(usrIds.map(function _callee10(id) {
            var user;
            return regeneratorRuntime.async(function _callee10$(_context16) {
              while (1) {
                switch (_context16.prev = _context16.next) {
                  case 0:
                    _context16.next = 2;
                    return regeneratorRuntime.awrap(Profile.findById(id.userId));

                  case 2:
                    user = _context16.sent;

                    // Find user by id
                    if (id.fmini == undefined) {
                      result = id.fantom;
                    } else if (id.fantom == undefined) {
                      result = id.fmini;
                    }

                    return _context16.abrupt("return", {
                      user_id: user._id,
                      userId: user.userId,
                      name: user.name,
                      prflimg: user.prflimg,
                      itemId: id.itemId,
                      result: result
                    });

                  case 5:
                  case "end":
                    return _context16.stop();
                }
              }
            });
          })));

        case 11:
          users = _context17.sent;
          combined = users.map(function (user) {
            var matchingFantom = usrIds.find(function (fantom) {
              return fantom._id === user.itemId;
            });
            var matchingFmini = usrIds.find(function (fmini) {
              return fmini._id === user.itemId;
            });
            return _objectSpread({}, user, {}, matchingFantom, {}, matchingFmini);
          });
          res.status(200).json(combined);

        case 14:
        case "end":
          return _context17.stop();
      }
    }
  });
};

module.exports = {
  findByFantom: findByFantom,
  findByFmini: findByFmini,
  findByTag: findByTag,
  findByFeeling: findByFeeling,
  findByCatagory: findByCatagory,
  findRecent: findRecent,
  findTrending: findTrending
};