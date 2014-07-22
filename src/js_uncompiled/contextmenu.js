goog.provide("codeshelf.contextmenu");
goog.require("goog.array");

/**
 * @constructor
 */
codeshelf.ContextMenu = function(contextDefs) {
	this.contextMenu_ = null;
	this.contextDefs_ = contextDefs;
};

codeshelf.ContextMenu.prototype.setupContextMenu = function() {
	this.contextMenu_ = $("<span class='contextMenu' style='display:none;position:absolute;z-index:20;' />").appendTo(document['body']);
	var this_ = this;
	this.contextMenu_.on('mouseleave', function(event) {
		this_.closeContextMenu();
	});
};

/**
 * @param event
 * @param {Object} item
 * @param {Slick.Grid.Column} column
 */
codeshelf.ContextMenu.prototype.doContextMenu = function(event, item, column) {
	if (event && event.stopPropagation)
		event.stopPropagation();

	event.preventDefault();
	this.contextMenu_.empty();
	var this_ = this; //might be dirty but gets it into the closures below
	goog.array.forEach(this.contextDefs_, function(contextDef) {
		var line = $('<li><a href="#">'+ contextDef["label"] +'</a></li>')
		  .appendTo(this_.contextMenu_)
		  .one("click", function () {
			  this_.closeContextMenu();
			  contextDef["action"](item);
		  });
	});

	$('html').on("click.outsidecontextmenu", function(event) {
		this_.closeContextMenu();
	});
	this.contextMenu_
		.css('top', event.pageY - 10)
		.css('left', event.pageX - 10)
		.fadeIn(5);

};

/**
 * @param {Object} item
 */
codeshelf.ContextMenu.prototype.closeContextMenu = function(item) {
	$(this.contextMenu_).fadeOut(5);
	$('html').off("click.outsidecontextmenu");
};
