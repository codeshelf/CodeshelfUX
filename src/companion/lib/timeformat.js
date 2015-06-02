var moment = require('moment');

moment.locale('en', {
    calendar : {
        lastDay : 'dd LT',
        sameDay : 'LT',
        nextDay : '[Tomorrow] LT',
        lastWeek : 'dd LT',
        nextWeek : '[next] dd [at] LT',
        sameElse : 'L'
    }
});

export function formatTimestamp(momentCompatibleDate, opt_relativetime) {
    var referenceTime = moment();
    if (opt_relativetime != null) {
        referenceTime = moment(opt_relativetime);
    }

    if (momentCompatibleDate === null || momentCompatibleDate === "") {
        return "";
    }

    var timeMoment = moment(momentCompatibleDate);
    return timeMoment.calendar(referenceTime);
}

export function formatDuration(momentCompatibleDuration) {
    return moment.duration(momentCompatibleDuration).humanize();
}
