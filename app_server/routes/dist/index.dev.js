"use strict";

var express = require('express');

var router = express.Router();

var _require = require('express-jwt'),
    jwt = _require.expressjwt;

var auth = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  userProperty: 'payload',
  getToken: function fromHeaderOrQuerystring(req) {
    if (req.cookies.indigotoken) {
      return req.cookies.indigotoken;
    }

    return null;
  }
});
/* GET home page. */

var ctrlMain = require('../controllers/main');

var ctrlSign = require('../controllers/sign');

var ctrlPrfl = require('../controllers/prflctlr');

var ctrlPosts = require('../controllers/posts');

router.route('/settings').get(ctrlMain.settings);
router.route('/fminiFeed').get(ctrlMain.fminiFeed); // fmini home page

router.route('/signin').get(ctrlSign.signin).post(ctrlSign.signinp);
router.route('/signup').get(ctrlSign.signup).post(ctrlSign.signupp);
router.route('/profile').get(ctrlMain.profile).post(ctrlPrfl.prflinfo); // router.route('/dream').get(ctrlMain.fmini)

router.route('/post').get(ctrlMain.drmpost);
router.route('/find').get(ctrlMain.find);
router.route('/messages').get(ctrlMain.messages);
router.route('/message/:name/:id').get(ctrlMain.message);
router.route('/notifications').get(ctrlMain.notifications);
router.route('/chapter/:fmId').get(ctrlMain.getChapterPostPage).post(ctrlPosts.chapterPost);
router.route('/hdrimg').post(ctrlPrfl.hdrimg);
router.route('/prflimg').post(ctrlPrfl.prflimg);
router.route('/fmini').post(ctrlPosts.fmini);
router.post('/pmsg', ctrlMain.pmsg);
router.post('/gmsg', ctrlMain.gmsg);
router.post('/updtMsgStats', ctrlMain.updtMsgStats);
router.post('/fantomPost', ctrlPosts.fantomPost);
router.get('/signup2/:emailtoken', ctrlSign.signupp2);
router.route('/signup3/:email/:name').post(ctrlSign.signupp3);
router.post('/postRxn', ctrlPosts.postRxn);
router.get('/fmini/:id', ctrlMain.fmini);
router.get('/:id/annexures', ctrlMain.annexures);
router.get('/:id/replies', ctrlMain.replies);
router.get('/:fminiId/:parentId/nestedReplies', ctrlMain.nestedReplies);
router.get('/:id/alters', ctrlMain.alters);
router.get('/fantoms', ctrlMain.fantoms); // fantom home page

router.get('/fantom/detail/:id', ctrlMain.fmDl); //fm id

router.get('/fantom/:id', ctrlMain.fantom);
router.route('/profile/fantom/detail/:id').get(ctrlMain.fmDl); //fm id

module.exports = router;