const express = require('express');
const router = express.Router();
const passport = require('passport');
const serialController = require('../controllers/serial.controller.server');
const episodeController = require('../controllers/episode.controller.server');
const userController = require('../controllers/user.controller.server');

let authorizeRequest = function(req, res, next){
    if (!req.isAuthenticated())
        res.json({error: 'Not authorized', errorCode: 401});
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

//#region serials
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

//#region episodes
router.get('/episodes', (req, res) => {
    episodeController.getEpisodes(req, res);
});

router.get('/episodes/id/:episode_id', (req, res) => {
    episodeController.getEpisodeById(req, res);
});

//#endregion


module.exports = router;
