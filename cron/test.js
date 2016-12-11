const CronJob = require('cron').CronJob;

let job = new CronJob({
    cronTime: '*/5 * * * * *',
    onTick: function () {
        setTimeout(() => {
            console.log(Date());
        }, 1000);
    },
    start: false,
    timeZone: 'Europe/Kiev'
});

job.start();