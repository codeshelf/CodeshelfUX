goog.provide('codeshelf.dateformat');

codeshelf.timeUnitAwareFormat = function(momentCompatibleDate, opt_relativetime) {
	var currentTime = moment();
	if (opt_relativetime != null) {
		currentTime = moment(opt_relativetime);
	}

	if (momentCompatibleDate == null) {
		return "";
	}

	var timeMoment  =  moment(momentCompatibleDate);
	if (moment(timeMoment).add(1, 'days').isAfter(currentTime)) {
		return timeMoment.format("HH:mm");
	}
	else if (moment(timeMoment).add(1, 'weeks').isAfter(currentTime)) {
		if (moment(timeMoment).isAfter(currentTime)) {
			return timeMoment.format('+dd HH:mm');
		} else {
			return timeMoment.format('dd HH:mm');
		}
	}
	else if (moment(timeMoment).add(1, 'years').isAfter(currentTime)) { //within a year
		return timeMoment.format('MMM_DD');
	}
	else {
		return timeMoment.format('MMMYYYY');
	}
}
