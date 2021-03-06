const express = require('express');
const router = express.Router();
const passport = require('passport');
const serialController = require('../controllers/serial.controller.server');
const episodeController = require('../controllers/episode.controller.server');
const userController = require('../controllers/user.controller.server');
const subscriptionController = require('../controllers/subscription.controller.server');

let authorizeRequest = function(req, res, next){
    if (!req.isAuthenticated())
        res.status(401).end();
    else next();
};

//todo function for admin authorize

router.get('/', function(req, res, next) {
    res.send('API description here.');
});

//#region User

router.get('/user', authorizeRequest, (req, res) => {
    req.user.password = undefined;
    res.json(req.user);
});

router.post('/users/register',(req, res) => {
    userController.registerNewUser(req, res);
});

router.post('/users/login', passport.authenticate('local'), (req, res) => {
    req.user.password = undefined;
    res.json(req.user);
});

router.get('/users/logout', (req, res) => {
    req.logout();
    res.json({success: true});
});

//#endregion

//#region Serials
router.get('/serials', (req, res) => {
    serialController.getSerials(req, res);
});

router.get('/serials/id/:_id', (req, res) =>{
    serialController.getSerialById(req,res);
});

router.get('/serials/serial_id/:serial_id', (req, res) => {
    serialController.getSerialBySerialId(req, res);
});

router.get('/serials/name/:serial_name', (req, res) => {
    serialController.getSerialByOriginalName(req,res);
});
//#endregion

//#region Episodes
router.get('/episodes', (req, res) => {
    episodeController.getEpisodes(req, res);
});

router.get('/episodes/id/:episode_id', (req, res) => {
    episodeController.getEpisodeById(req, res);
});

router.get('/episodes/:serial_id/:season/:episode', (req, res) => {
   episodeController.getEpisodesStrictly(req, res);
});

//#endregion

//#region Subscriptions
router.get('/subscriptions', authorizeRequest, (req, res) => {
    subscriptionController.getSubscriptions(req, res);
});
router.post('/subscriptions', authorizeRequest, (req, res) => {
    subscriptionController.addSubscription(req, res);
});
router.put('/subscriptions', authorizeRequest, (req, res) => {
    subscriptionController.editSubscription(req, res);
});
router.delete('/subscriptions', authorizeRequest, (req, res) => {
    subscriptionController.deleteSubscription(req, res);
});
//#endregion


module.exports = router;
