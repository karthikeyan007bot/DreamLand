"use strict";

var express = require('express');

var router = express.Router();

var ctrlAuth = require('../controllers/authentication');

var ctrlMain = require('../controllers/main');

var ctrlProfile = require('../controllers/prflctlr');

var ctrlFind = require('../controllers/find_ctrl');

router.post('/signup', ctrlAuth.signup);
router.post('/signin', ctrlAuth.signin);
router.post('/glsignup', ctrlAuth.glsignup);
router.post('/glsignin', ctrlAuth.glsignin);
router.post('/profile', ctrlProfile.pstbasicprflinfo);
router.post('/hdrimg', ctrlProfile.hdrimg);
router.post('/prflimg', ctrlProfile.prflimg);
router.get('/getProfile', ctrlProfile.getProfile);
router.post('/fmini', ctrlMain.fmini);
router.get('/userByUserId/:userId', ctrlMain.users);
router.get('/topUsers/:id', ctrlMain.topUsers);
router.post('/pmsg', ctrlMain.pmsg);
router.post('/gmsg', ctrlMain.gmsg);
router.post('/updtMsgStats', ctrlMain.updtMsgStats);
router.post('/dltmsg', ctrlMain.dltmsg);
router.post('/fantom', ctrlMain.fantom);
router.post('/checkMail', ctrlProfile.checkMail);
router.post('/postRxn', ctrlMain.postRxn);
router.post('/postCommonReply', ctrlMain.postCommonReply);
router.get('/fminiFeed', ctrlMain.fminiFeed);
router.post('/fantoms', ctrlMain.fantoms);
router.get('/fmini/:id', ctrlMain.getFmini);
router.post('/users', ctrlMain.getUsers);
router.post('/users2', ctrlMain.getUsers2); // finds user only with id

router.get('/user/:usrRefId', ctrlMain.getUser);
router.get('/:id/annexures', ctrlMain.getFmini);
router.get('/:id/replies', ctrlMain.getFmini);
router.get('/:fminiId/:parentId/nestedReplies', ctrlMain.getNestedReply);
router.get('/:id/alters', ctrlMain.getFmini);
router.get('/fantom/detail/:id', ctrlMain.fmDl);
router.get('/fantoms/detail/:id', ctrlMain.fmsDl); //id--> usrRefId

router.get('/fminis/detail/:id', ctrlMain.fminisDl); //id--> usrRefId

router.get('/fantom/:id', ctrlMain.getFantom);
router.get('/replies/:id', ctrlMain.usrReplies);
router.get('/annexes/:id', ctrlMain.usrAnnexes);
router.get('/alters/:id', ctrlMain.usrAlters);
router.post('/postFminiTarget', ctrlMain.postFminiTarget);
router.get('/:fminiId/:parentId/rxns', ctrlMain.getRxns);
router.get("/find/fantom/:value", ctrlFind.findByFantom);
router.get("/find/fmini/:value", ctrlFind.findByFmini);
router.get("/find/tag/:value", ctrlFind.findByTag);
router.get("/find/feeling/:value", ctrlFind.findByFeeling);
router.get("/find/catagory/:value", ctrlFind.findByCatagory);
router.get("/find/recent/:value", ctrlFind.findRecent);
router.get("/find/trending/:value", ctrlFind.findTrending);
router.post('/report', ctrlMain.report);
router.post('/block', ctrlMain.saveSettings);
router.post('/chapter/:fmId', ctrlMain.chapterPost);
module.exports = router;