"use strict";

var passport = require('passport');

var mongoose = require('mongoose');

var User = mongoose.model('Profile');

var _require = require('google-auth-library'),
    OAuth2Client = _require.OAuth2Client;

var generateUniqueId = require('generate-unique-id');

var signup = function signup(req, res) {
  console.log(req.body);

  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).json({
      'message': 'All fields required'
    });
  }

  var user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.userId = req.body.userId;
  user.setPassword(req.body.password);
  user.save(function (err) {
    if (err) {
      if (err.index == 0 && err.code == 11000) {
        console.log(err); // return res.status(400).json({"code" : "11000"})
      }

      return res.status(400).json(err);
    } else {
      var token = user.generateJwt();
      res.status(200).json({
        token: token
      });
    }
  });
};

var signin = function signin(req, res) {
  if (!req.body.email || !req.body.password) {
    return res.status(404).json({
      'message': 'All fields required'
    });
  }

  passport.authenticate('local', function (err, user, info) {
    var token;

    if (err) {
      return res.status(404).json(err);
    }

    if (user) {
      token = user.generateJwt();
      res.status(200).json({
        token: token
      });
    } else {
      res.status(404).json(info);
    }
  })(req, res);
};

var glsignup = function glsignup(req, res) {
  var client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  function verify() {
    var ticket, payload, user;
    return regeneratorRuntime.async(function verify$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(client.verifyIdToken({
              idToken: req.body.credential,
              audience: process.env.GOOGLE_CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
              // Or, if multiple clients access the backend:
              //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]

            }));

          case 2:
            ticket = _context.sent;
            payload = ticket.getPayload(); // If request specified a G Suite domain:
            // const domain = payload['hd'];

            user = new User();
            user.name = payload.name;
            user.email = payload.email;
            user.picture = payload.picture;
            user.userId = generateUniqueId({
              length: 8
            });
            user.save(function (err) {
              if (err) {
                if (err.index == 0 && err.code == 11000) {
                  return res.status(400).json({
                    "code": "11000"
                  });
                } else {
                  console.log(err);
                }
              } else {
                var tok = user.generateJwt();
                res.status(200).json(tok);
              }
            });

          case 10:
          case "end":
            return _context.stop();
        }
      }
    });
  }

  verify()["catch"](console.error);
};

var glsignin = function glsignin(req, res) {
  var client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  function verify() {
    var ticket, payload, tok;
    return regeneratorRuntime.async(function verify$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return regeneratorRuntime.awrap(client.verifyIdToken({
              idToken: req.body.credential,
              audience: process.env.GOOGLE_CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
              // Or, if multiple clients access the backend:
              //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]

            }));

          case 2:
            ticket = _context2.sent;
            payload = ticket.getPayload();
            User.findOne({
              email: payload.email
            }, function (err, user) {
              if (!user) {
                return res.status(400).json({
                  "code": "11001"
                });
              } else if (err) {
                return res.status(400).json(err);
              } else if (user) {
                tok = user.generateJwt();
                return res.status(200).json(tok);
              }
            });

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    });
  }

  verify()["catch"](console.error);
};

module.exports = {
  signup: signup,
  signin: signin,
  glsignup: glsignup,
  glsignin: glsignin
};