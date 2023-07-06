"use strict";

var express = require('express');

var router = express.Router();

var axios = require('axios');

var fileUpload = require('express-fileupload');

var jwt = require('jsonwebtoken');

var server = {
  url: 'http://localhost:3000'
};

var fmini = function fmini(req, res) {
  var decoded = jwt.verify(req.cookies.indigotoken, process.env.JWT_SECRET);
  axios.post("".concat(server.url, "/api/fmini"), {
    refId: decoded._id,
    media: req.body.media,
    body: req.body.body,
    mood: req.body.mood,
    settings: req.body.settings,
    tags: req.body.tags,
    catagory: req.body.catagory,
    userId: decoded.userId,
    userName: decoded.name
  }).then(function (resp) {
    res.status(201).json('ok');
  })["catch"](function (err) {
    return console.log(err);
  });
};

var chapterPost = function chapterPost(req, res) {
  axios.post("".concat(server.url, "/api/chapter/").concat(req.params.fmId), {
    title: req.body.title,
    chapter: req.body.chapter
  }).then(function () {
    return res.redirect('/fminiFeed');
  })["catch"](function (err) {
    return console.log(err);
  });
};

var fantomPost = function fantomPost(req, res) {
  var decoded = jwt.verify(req.cookies.indigotoken, process.env.JWT_SECRET);
  axios.post("".concat(server.url, "/api/fantom"), {
    userId: decoded.userId,
    userName: decoded.name,
    title: req.body.title,
    desc: req.body.desc,
    tags: req.body.tags,
    catagory: req.body.catagory,
    prota: req.body.prota,
    anta: req.body.anta,
    deuta: req.body.deuta,
    tert: req.body.tert,
    feelings: req.body.feelings,
    age_rating: req.body.age_rating,
    who_can_see: req.body.who_can_see,
    post_as: req.body.post_as,
    backGround: req.body.backGround,
    cover: req.body.cover,
    usrRefId: req.body.usrRefId
  }).then(function (resp) {
    res.redirect("/chapter/".concat(resp.data));
  })["catch"](function (err) {
    return console.log(err);
  });
};

var postRxn = function postRxn(req, res) {
  console.log(req.body);
};

module.exports = {
  fmini: fmini,
  fantomPost: fantomPost,
  postRxn: postRxn,
  chapterPost: chapterPost
};