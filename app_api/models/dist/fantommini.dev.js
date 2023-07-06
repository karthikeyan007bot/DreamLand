"use strict";

var mongoose = require('mongoose');

var reactionsSchema = new mongoose.Schema({
  reaction: String,
  usrRefId: String
});
var replySchema = new mongoose.Schema({
  body: String,
  media: String,
  usrRefId: String,
  fminiRefId: String,
  timeStamp: {
    type: Date,
    "default": Date.now()
  },
  reactions: [reactionsSchema]
});
replySchema.add({
  replies: [replySchema]
});
var annexSchema = new mongoose.Schema({
  body: String,
  media: String,
  usrRefId: String,
  fminiRefId: String,
  reactions: [reactionsSchema],
  timeStamp: {
    type: Date,
    "default": Date.now()
  }
});
annexSchema.add({
  replies: [replySchema]
});
var alterSchema = new mongoose.Schema({
  body: String,
  media: String,
  usrRefId: String,
  fminiRefId: String,
  reactions: [reactionsSchema],
  timeStamp: {
    type: Date,
    "default": Date.now()
  }
});
alterSchema.add({
  replies: [replySchema]
});
var miniSchema = new mongoose.Schema({
  userName: String,
  userId: String,
  refId: String,
  body: String,
  settings: Object,
  media: String,
  tags: Array,
  mood: String,
  catagory: String,
  reactions: [reactionsSchema],
  replies: [replySchema],
  alters: [alterSchema],
  annexes: [annexSchema],
  timeStamp: {
    type: Date,
    "default": Date.now()
  }
});
mongoose.model('Fmini', miniSchema);