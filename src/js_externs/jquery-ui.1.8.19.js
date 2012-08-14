$.expr.match = {};
$.expr.match.ID;
$.expr.match.CLASS;
$.expr.match.NAME;
$.expr.match.ATTR;
$.expr.match.TAG;
$.expr.match.CHILD;
$.expr.match.POS;
$.expr.match.PSEUDO;

var Datepicker = {
	"Datepicker" : {
		_defaults : {
			showOn : 'focus',
			showAnim : 'fadeIn',
			showOptions : {},
			defaultDate : null,
			appendText : '',
			buttonText : '...',
			buttonImage : '',
			buttonImageOnly : false,
			hideIfNoPrevNext : false,
			navigationAsDateFormat : false,
			gotoCurrent : false,
			changeMonth : false,
			changeYear : false,
			yearRange : 'c-10:c+10',
			showOtherMonths : false,
			selectOtherMonths : false,
			showWeek : false,
			calculateWeek : this.iso8601Week,
			shortYearCutoff : '+10',
			minDate : null,
			maxDate : null,
			duration : 'fast',
			beforeShowDay : null,
			beforeShow : null,
			onSelect : null,
			onChangeMonthYear : null,
			onClose : null,
			numberOfMonths : 1,
			showCurrentAtPos : 0,
			stepMonths : 1,
			stepBigMonths : 12,
			altField : '',
			altFormat : '',
			constrainInput : true,
			showButtonPanel : false,
			autoSize : false,
			disabled : false
		}
	}
};

jQuery.prototype.easing = function() {};
jQuery.easing = {
		def: 'easeOutQuad',
		swing: function (x, t, b, c, d) {
		},
		easeInQuad: function (x, t, b, c, d) {
		},
		easeOutQuad: function (x, t, b, c, d) {
		},
		easeInOutQuad: function (x, t, b, c, d) {
		},
		easeInCubic: function (x, t, b, c, d) {
		},
		easeOutCubic: function (x, t, b, c, d) {
		},
		easeInOutCubic: function (x, t, b, c, d) {
		},
		easeInQuart: function (x, t, b, c, d) {
		},
		easeOutQuart: function (x, t, b, c, d) {
		},
		easeInOutQuart: function (x, t, b, c, d) {
		},
		easeInQuint: function (x, t, b, c, d) {
		},
		easeOutQuint: function (x, t, b, c, d) {
		},
		easeInOutQuint: function (x, t, b, c, d) {
		},
		easeInSine: function (x, t, b, c, d) {
		},
		easeOutSine: function (x, t, b, c, d) {
		},
		easeInOutSine: function (x, t, b, c, d) {
		},
		easeInExpo: function (x, t, b, c, d) {
		},
		easeOutExpo: function (x, t, b, c, d) {
		},
		easeInOutExpo: function (x, t, b, c, d) {
		},
		easeInCirc: function (x, t, b, c, d) {
		},
		easeOutCirc: function (x, t, b, c, d) {
		},
		easeInOutCirc: function (x, t, b, c, d) {
		},
		easeInElastic: function (x, t, b, c, d) {
		},
		easeOutElastic: function (x, t, b, c, d) {
		},
		easeInOutElastic: function (x, t, b, c, d) {
		},
		easeInBack: function (x, t, b, c, d, s) {
		},
		easeOutBack: function (x, t, b, c, d, s) {
		},
		easeInOutBack: function (x, t, b, c, d, s) {
		},
		easeInBounce: function (x, t, b, c, d) {
		},
		easeOutBounce: function (x, t, b, c, d) {
		},
		easeInOutBounce: function (x, t, b, c, d) {
		}
	};


Datepicker.prototype._hideDatepicker = function() {};
Datepicker.prototype._destroyDatepicker = function() {};
Datepicker.prototype._adjustDate = function() {};
Datepicker.prototype._selectDay = function() {};

Datepicker.regional = {
	closeText : 'Done',
	prevText : 'Prev',
	nextText : 'Next',
	currentText : 'Today',
	monthNames : [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November',
			'December' ],
	monthNamesShort : [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
	dayNames : [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ],
	dayNamesShort : [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],
	dayNamesMin : [ 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa' ],
	weekHeader : 'Wk',
	dateFormat : 'mm/dd/yy',
	firstDay : 0,
	isRTL : false,
	showMonthAfterYear : false,
	yearSuffix : ''
};
Datepicker._defaults = {
	showOn : 'focus',
	showAnim : 'fadeIn',
	showOptions : {},
	defaultDate : null,
	appendText : '',
	buttonText : '...',
	buttonImage : '',
	buttonImageOnly : false,
	hideIfNoPrevNext : false,
	navigationAsDateFormat : false,
	gotoCurrent : false,
	changeMonth : false,
	changeYear : false,
	yearRange : 'c-10:c+10',
	showOtherMonths : false,
	selectOtherMonths : false,
	showWeek : false,
	calculateWeek : this.iso8601Week,
	shortYearCutoff : '+10',
	minDate : null,
	maxDate : null,
	duration : 'fast',
	beforeShowDay : null,
	beforeShow : null,
	onSelect : null,
	onChangeMonthYear : null,
	onClose : null,
	numberOfMonths : 1,
	showCurrentAtPos : 0,
	stepMonths : 1,
	stepBigMonths : 12,
	altField : '',
	altFormat : '',
	constrainInput : true,
	showButtonPanel : false,
	autoSize : false,
	disabled : false
};

var $ = {
	"$" : {
		"ui" : {
			"version" : {},
			"keyCode" : {
				"ALT" : {},
				"BACKSPACE" : {},
				"CAPS_LOCK" : {},
				"COMMA" : {},
				"COMMAND" : {},
				"COMMAND_LEFT" : {},
				"COMMAND_RIGHT" : {},
				"CONTROL" : {},
				"DELETE" : {},
				"DOWN" : {},
				"END" : {},
				"ENTER" : {},
				"ESCAPE" : {},
				"HOME" : {},
				"INSERT" : {},
				"LEFT" : {},
				"MENU" : {},
				"NUMPAD_ADD" : {},
				"NUMPAD_DECIMAL" : {},
				"NUMPAD_DIVIDE" : {},
				"NUMPAD_ENTER" : {},
				"NUMPAD_MULTIPLY" : {},
				"NUMPAD_SUBTRACT" : {},
				"PAGE_DOWN" : {},
				"PAGE_UP" : {},
				"PERIOD" : {},
				"RIGHT" : {},
				"SHIFT" : {},
				"SPACE" : {},
				"TAB" : {},
				"UP" : {},
				"WINDOWS" : {}
			},
			"plugin" : {
				"add" : function() {
				},
				"call" : function() {
				}
			},
			"contains" : function() {
			},
			"hasScroll" : function() {
			},
			"isOverAxis" : function() {
			},
			"isOver" : function() {
			},
			"mouse" : function() {
			},
			"draggable" : function() {
			},
			"droppable" : function() {
			},
			"intersect" : function() {
			},
			"ddmanager" : {
				"current" : function() {
				},
				"droppables" : {
					"default" : function() {
					}
				},
				"prepareOffsets" : function() {
				},
				"drop" : function() {
				},
				"dragStart" : function() {
				},
				"drag" : function() {
				},
				"dragStop" : function() {
				}
			},
			"resizable" : function() {
			},
			"selectable" : function() {
			},
			"sortable" : function() {
			},
			"accordion" : function() {
			},
			"autocomplete" : function() {
			},
			"menu" : function() {
			},
			"button" : function() {
			},
			"buttonset" : function() {
			},
			"datepicker" : {
				"version" : {}
			},
			"dialog" : function() {
			},
			"position" : {
				"fit" : {
					"left" : function() {
					},
					"top" : function() {
					}
				},
				"flip" : {
					"left" : function() {
					},
					"top" : function() {
					}
				}
			},
			"progressbar" : function() {
			},
			"slider" : function() {
			},
			"tabs" : function() {
			}
		},

		"fn" : {
			"init" : function() {
			},
			"selector" : {},
			"jquery" : {},
			"size" : function() {
			},
			"get" : function() {
			},
			"pushStack" : function() {
			},
			"setArray" : function() {
			},
			"each" : function() {
			},
			"index" : function() {
			},
			"attr" : function() {
			},
			"css" : function() {
			},
			"text" : function() {
			},
			"wrapAll" : function() {
			},
			"wrapInner" : function() {
			},
			"wrap" : function() {
			},
			"append" : function() {
			},
			"prepend" : function() {
			},
			"before" : function() {
			},
			"after" : function() {
			},
			"end" : function() {
			},
			"push" : function() {
			},
			"sort" : function() {
			},
			"splice" : function() {
			},
			"find" : function() {
			},
			"clone" : function() {
			},
			"filter" : function() {
			},
			"closest" : function() {
			},
			"not" : function() {
			},
			"add" : function() {
			},
			"is" : function() {
			},
			"hasClass" : function() {
			},
			"val" : function() {
			},
			"html" : function() {
			},
			"replaceWith" : function() {
			},
			"eq" : function() {
			},
			"slice" : function() {
			},
			"map" : function() {
			},
			"andSelf" : function() {
			},
			"domManip" : function() {
			},
			"extend" : function() {
			},
			"parent" : function() {
			},
			"parents" : function() {
			},
			"next" : function() {
			},
			"prev" : function() {
			},
			"nextAll" : function() {
			},
			"prevAll" : function() {
			},
			"siblings" : function() {
			},
			"children" : function() {
			},
			"contents" : function() {
			},
			"appendTo" : function() {
			},
			"prependTo" : function() {
			},
			"insertBefore" : function() {
			},
			"insertAfter" : function() {
			},
			"replaceAll" : function() {
			},
			"removeAttr" : function() {
			},
			"addClass" : function() {
			},
			"removeClass" : function() {
			},
			"toggleClass" : function() {
			},
			"remove" : function() {
			},
			"empty" : function() {
			},
			"data" : function() {
			},
			"removeData" : function() {
			},
			"queue" : function() {
			},
			"dequeue" : function() {
			},
			"bind" : function() {
			},
			"one" : function() {
			},
			"unbind" : function() {
			},
			"trigger" : function() {
			},
			"triggerHandler" : function() {
			},
			"toggle" : function() {
			},
			"hover" : function() {
			},
			"ready" : function() {
			},
			"live" : function() {
			},
			"die" : function() {
			},
			"blur" : function() {
			},
			"focus" : function() {
			},
			"load" : function() {
			},
			"resize" : function() {
			},
			"scroll" : function() {
			},
			"unload" : function() {
			},
			"click" : function() {
			},
			"dblclick" : function() {
			},
			"mousedown" : function() {
			},
			"mouseup" : function() {
			},
			"mousemove" : function() {
			},
			"mouseover" : function() {
			},
			"mouseout" : function() {
			},
			"mouseenter" : function() {
			},
			"mouseleave" : function() {
			},
			"change" : function() {
			},
			"select" : function() {
			},
			"submit" : function() {
			},
			"keydown" : function() {
			},
			"keypress" : function() {
			},
			"keyup" : function() {
			},
			"error" : function() {
			},
			"_load" : function() {
			},
			"serialize" : function() {
			},
			"serializeArray" : function() {
			},
			"ajaxStart" : function() {
			},
			"ajaxStop" : function() {
			},
			"ajaxComplete" : function() {
			},
			"ajaxError" : function() {
			},
			"ajaxSuccess" : function() {
			},
			"ajaxSend" : function() {
			},
			"show" : function() {
			},
			"hide" : function() {
			},
			"_toggle" : function() {
			},
			"fadeTo" : function() {
			},
			"animate" : function() {
			},
			"stop" : function() {
			},
			"slideDown" : function() {
			},
			"slideUp" : function() {
			},
			"slideToggle" : function() {
			},
			"fadeIn" : function() {
			},
			"fadeOut" : function() {
			},
			"offset" : function() {
			},
			"position" : function() {
			},
			"offsetParent" : function() {
			},
			"scrollLeft" : function() {
			},
			"scrollTop" : function() {
			},
			"innerHeight" : function() {
			},
			"outerHeight" : function() {
			},
			"height" : function() {
			},
			"innerWidth" : function() {
			},
			"outerWidth" : function() {
			},
			"width" : function() {
			},
			"propAttr" : function() {
			},
			"_focus" : function() {
			},
			"scrollParent" : function() {
			},
			"zIndex" : function() {
			},
			"disableSelection" : function() {
			},
			"enableSelection" : function() {
			},
			"mouse" : function() {
			},
			"draggable" : function() {
			},
			"droppable" : function() {
			},
			"resizable" : function() {
			},
			"selectable" : function() {
			},
			"sortable" : function() {
			},
			"_addClass" : function() {
			},
			"_removeClass" : function() {
			},
			"_toggleClass" : function() {
			},
			"switchClass" : function() {
			},
			"effect" : function() {
			},
			"_show" : function() {
			},
			"_hide" : function() {
			},
			"__toggle" : function() {
			},
			"cssUnit" : function() {
			},
			"accordion" : function() {
			},
			"autocomplete" : function() {
			},
			"menu" : function() {
			},
			"button" : function() {
			},
			"buttonset" : function() {
			},
			"datepicker" : function() {
			},
			"dialog" : function() {
			},
			"progressbar" : function() {
			},
			"slider" : function() {
			},
			"tabs" : function() {
			}
		}
	}
};