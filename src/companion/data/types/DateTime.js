import timeformat from "lib/timeformat";

export default class DateTime {
    static getDefaultFormatter(value) {
        return timeformat.formatTimestamp;

    }
}
