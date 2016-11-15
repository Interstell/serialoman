const express = require('express');
const router = express.Router();
const passport = require('passport');
const serialController = require('../controllers/serial.controller.server');
const episodeController = require('../controllers/episode.controller.server');
const userController = require('../controllers/user.controller.server');

let authorizeRequest = function(req, res, next){
    if (!req.isAuthenticated())
        res.sendStatus(401);
    else next();
};

//todo function for admin authorize

router.get('/', function(req, res, next) {
    res.send('API description here.');
});

router.get('/user', authorizeRequest, (req, res) => {
    res.json(req.user);
});

router.post('/user/register',(req, res) => {
    userController.registerNewUser(req, res);
});

router.post('/users/login', passport.authenticate('local'), (req, res) => {
    res.send(req.user);
});

//#region serials
router.get('/serials', (req, res) => {
    serialController.getSerials(req, res);
});

router.get('/serials/id/:serial_id', (req, res) =>{
    serialController.getSerialById(req,res);
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
