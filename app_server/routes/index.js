var express = require('express');
var router = express.Router();
// const {expressjwt: jwt } = require('express-jwt');
// const auth = jwt({
//     secret:process.env.JWT_SECRET,
//     algorithms:["HS256"],
//     userProperty : 'payload',
//     getToken: function fromHeaderOrQuerystring(req) {
//         if (req.cookies.indigotoken) {
//           return req.cookies.indigotoken
//         }
//         return null;
//       }   
// })
/* GET home page. */
const ctrlMain = require('../controllers/main')
const ctrlSign = require('../controllers/sign')
const ctrlPrfl = require('../controllers/prflctlr')
const ctrlPosts = require('../controllers/posts')

router.route('/settings').get(ctrlMain.settings)
router.route('/home').get(ctrlMain.fminiFeed) // fmini home page
router.route('/').get(ctrlMain.fminiFeed) // fmini home page
router.route('/signin').get(ctrlSign.signin).post(ctrlSign.signinp)
router.route('/signup').get(ctrlSign.signup).post(ctrlSign.signupp)
router.route('/profile').get(ctrlPrfl.profile).post(ctrlPrfl.prflinfo)
// router.route('/dream').get(ctrlMain.fmini)
router.route('/post').get(ctrlMain.drmpost)
router.route('/find').get(ctrlMain.find)
router.route('/messages').get(ctrlMain.messages)
router.route('/message/:name/:id').get(ctrlMain.message)
router.route('/notifications').get(ctrlMain.notifications)
router.route('/chapter/:fmId').get(ctrlMain.getChapterPostPage).post(ctrlPosts.chapterPost)
router.route('/hdrimg').post(ctrlPrfl.hdrimg)
router.route('/prflimg').post(ctrlPrfl.prflimg)
router.route('/fmini').post(ctrlPosts.fmini)
router.post('/pmsg', ctrlMain.pmsg)
router.post('/gmsg', ctrlMain.gmsg)
router.post('/updtMsgStats', ctrlMain.updtMsgStats)
router.post('/fantomPost', ctrlPosts.fantomPost)
router.get('/signup2/:emailtoken', ctrlSign.signupp2)
router.route('/signup3/:email/:name').post(ctrlSign.signupp3)
router.post('/postRxn', ctrlPosts.postRxn)
router.get('/fmini/:id', ctrlMain.fmini)
router.get('/:id/alters', ctrlMain.alters)
router.get('/:id/annexures', ctrlMain.annexures)
router.get('/:id/replies', ctrlMain.replies)
router.get('/:fminiId/:parentId/nestedReplies', ctrlMain.nestedReplies)
router.get('/fantoms', ctrlMain.fantoms) // fantom home page
router.get('/fantom/detail/:id', ctrlMain.fmDl) //fm id
router.route('/profile/fantom/detail/:id').get(ctrlMain.fmDl) //fm id
router.route('/:fmId/chapter/:chapterId').get(ctrlMain.chapter)
router.route('/user/:userId').get(ctrlPrfl.user_profile)
router.get('/privacy', ctrlMain.privacy)
router.get('/guide', ctrlMain.guide)
router.get('/terms_of_use', ctrlMain.terms_of_use)
router.get('/about', ctrlMain.welcome)
module.exports = router;
