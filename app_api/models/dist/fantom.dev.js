"use strict";

var mongoose = require('mongoose');

var reactionsSchema = new mongoose.Schema({
  reaction: String,
  usrRefId: String
});
var replySchema = new mongoose.Schema({
  reply: String,
  media: String,
  usrRefId: String,
  fminiRefId: String,
  timeStamp: {
    type: Date,
    "default": Date.now()
  },
  reactions: [reactionsSchema]
});
var chapterSchema = new mongoose.Schema({
  title: String,
  chapter: String
});
replySchema.add({
  replies: [replySchema]
});
var fantomSchema = new mongoose.Schema({
  title: String,
  desc: String,
  tags: Array,
  catagory: String,
  prota: Array,
  anta: Array,
  deuta: Array,
  tert: Array,
  feelings: Array,
  age_rating: Boolean,
  who_can_see: String,
  post_as: String,
  backGround: Array,
  usrRefId: String,
  cover: String,
  replies: [replySchema],
  reactions: [reactionsSchema],
  chapters: [chapterSchema]
});
mongoose.model('Fantom', fantomSchema);