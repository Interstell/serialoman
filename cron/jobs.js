const CronJob = require('cron').CronJob;
const LostfilmSerialChecker = require('../parser/lostfilm/lostfilm.serial.check_for_new');
const LostfilmEpisodeChecker = require('../parser/lostfilm/lostfilm.episode.check_for_new');
const NewstudioSerialChecker = require('../parser/newstudio/newstudio.serial.check_for_new')
const NewstudioEpisodeChecker = require('../parser/newstudio/newstudio.episode.check_for_new');

/*
* seconds: 0-59
* minutes: 0-59
* hours: 0-23
* day of month: 1-31
* months: 0-11
* day of week: 0-6 (0-sunday)
*/

let NSNewEpisodeJob  = new CronJob({
    cronTime: '0 */5 * * * *', //each 5 minutes e.g. 00 05 10..
    onTick: function () {
        console.log('[NS Parser] Starting to parse new episodes...');
        NewstudioEpisodeChecker.checkForNewEpisodes();
    },
    start: false,
    timeZone: 'Europe/Kiev'
});

let LFNewEpisodeJob = new CronJob({
    cronTime: '0 */5 * * * *', //each 5 minutes + 2 e.g. 02 07 12..
    onTick: function () {
        setTimeout(() => {
            console.log('[LF Parser] Starting to parse new episodes...');
            LostfilmEpisodeChecker.checkForNewEpisodes();
        }, 2*60*1000);

    },
    start: false,
    timeZone: 'Europe/Kiev'
});

let NSNewSerialsJob = new CronJob({
    cronTime: '0 0 3 * * *', //every day at 3 AM
    onTick: function () {
        console.log('[NS Parser] Starting to parse new serials...');
        NewstudioSerialChecker.checkForNewSerials();
    },
    start: false,
    timeZone: 'Europe/Kiev'
});



let LFNewSerialsJob = new CronJob({
    cronTime: '0 0 4 * * 0', //every day at 4 AM
    onTick: function () {
        console.log('[LF Parser] Starting to parse new serials...');
        LostfilmSerialChecker.checkForNewSerials();
    },
    start: false,
    timeZone: 'Europe/Kiev'
});

exports.startJobs = function () {
    NSNewEpisodeJob.start();
    LFNewEpisodeJob.start();
    NSNewSerialsJob.start();
    LFNewSerialsJob.start();
};