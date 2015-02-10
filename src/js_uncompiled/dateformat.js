goog.provide('codeshelf.dateformat');

codeshelf.toISOString = function(momentCompatibleDate) {
    return moment(momentCompatibleDate).toISOString();
};

codeshelf.toJSDate = function(momentCompatibleDate) {
    return moment(momentCompatibleDate).toDate();
};


codeshelf.conciseDateTimeFormat = function(momentCompatibleDate, opt_relativetime) {
	var currentTime = moment();
	if (opt_relativetime != null) {
		currentTime = moment(opt_relativetime);
	}

	if (momentCompatibleDate == null) {
		return "";
	}

	var timeMoment  =  moment(momentCompatibleDate);
	if (moment(timeMoment).isAfter(currentTime)) {
		if(moment(timeMoment).isSame(currentTime, 'day')) {
			return timeMoment.format("+HH:mm");
		} else {
			return timeMoment.format('+dd HH:mm');
		}
	}
	else if (moment(timeMoment).add(1, 'days').isAfter(currentTime)) {
		return timeMoment.format("HH:mm");
	}
	else if (moment(timeMoment).add(1, 'weeks').isAfter(currentTime)) {
		return timeMoment.format('dd HH:mm');
	}
	else if (moment(timeMoment).add(1, 'years').isAfter(currentTime)) { //within a year
		return timeMoment.format('MMM_DD');
	}
	else {
		return timeMoment.format('MMMYYYY');
	}
}

codeshelf.conciseDateFormat = function(momentCompatibleDate, opt_relativetime) {
	var currentTime = moment();
	if (opt_relativetime != null) {
		currentTime = moment(opt_relativetime);
	}

	if (momentCompatibleDate == null) {
		return "Today";
	}

	var timeMoment  =  moment(momentCompatibleDate);
	if (moment(timeMoment).isAfter(currentTime)) {
		if(moment(timeMoment).isSame(currentTime, 'day')) {
			return "Today";
		} else {
			return timeMoment.format('+dd');
		}
	}
	else if (moment(timeMoment).add(1, 'days').isAfter(currentTime)) {
		return "Today";
	}
	else if (moment(timeMoment).add(1, 'weeks').isAfter(currentTime)) {
		return timeMoment.format('dd');
	}
	else if (moment(timeMoment).add(1, 'years').isAfter(currentTime)) { //within a year
		return timeMoment.format('MMM_DD');
	}
	else {
		return timeMoment.format('MMM_DD_YYYY');
	}
}
