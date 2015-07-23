var timeformat = require("lib/timeformat");

export default class DateTime {
    static getDefaultFormatter(value) {
        return timeformat.formatTimestamp;

    }
}
