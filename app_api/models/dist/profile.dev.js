"use strict";

var mongoose = require('mongoose');

var crypto = require('crypto');

var jwt = require('jsonwebtoken');

var profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    unique: true
  },
  about: String,
  settings: {
    hide_sensitivity: Boolean,
    blocked_users: Array,
    profile_visibility: Boolean,
    direct_message: String,
    whocanseebd: String
  },
  prflimg: String,
  joinedat: String,
  followers: Array,
  following: Array,
  fbusrname: String,
  bddate: String,
  bdmonth: String,
  bdyear: String,
  gender: String,
  fantoms: Array,
  fantomMini: Array,
  annexes: Array,
  alters: Array,
  replies: Array,
  reactions: Array,
  hash: String,
  salt: String
});

profileSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

profileSchema.methods.validPassword = function (password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

profileSchema.methods.generateJwt = function () {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);
  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    userId: this.userId,
    prflImg: this.prflimg,
    exp: parseInt(expiry.getTime() / 1000)
  }, process.env.JWT_SECRET);
};

mongoose.model('Profile', profileSchema);