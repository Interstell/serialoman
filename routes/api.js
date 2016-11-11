var express = require('express');
var router = express.Router();
const serialController = require('../controllers/serial.controller.server');
const episodeController = require('../controllers/episode.controller.server');


router.get('/', function(req, res, next) {
  res.send('API description here.');
});

//#region serials
router.get('/serials', (req, res) => {
  serialController.getSerials(req, res);
});

router.get('/serials/id/:serial_id', (req, res) =>{
  serialController.getSerialById(req,res);
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
