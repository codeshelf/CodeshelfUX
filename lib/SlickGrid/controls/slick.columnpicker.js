goog.provide('slickgrid.columnpicker');
goog.require('slickgrid.core');

(function($) {
	function SlickColumnPicker(columns, grid, options) {
		var $menu;
		var columnCheckboxes;

		var defaults = {
			fadeSpeed: 250
		};

		function init() {
			grid.onHeaderContextMenu.subscribe(handleHeaderContextMenu);
			options = $.extend({}, defaults, options);

			$menu = $("<span class='slick-columnpicker' style='display:none;position:absolute;z-index:20;' />").appendTo(document.body);

			$menu.bind("mouseleave", function(e) {
				$(this).fadeOut(options['fadeSpeed'])
			});
			$menu.bind("click", updateColumn);

		}

		function handleHeaderContextMenu(e, args) {
			e.preventDefault();
			$menu.empty();
			columnCheckboxes = [];

			var $li, $input;
			for (var i = 0; i < columns.length; i++) {
				$li = $("<li />").appendTo($menu);
				$input = $("<input type='checkbox' />").data("column-id", columns[i].id);
				columnCheckboxes.push($input);

				if (grid.getColumnIndex(columns[i].id) != null) {
					$input.attr("checked", "checked");
				}

				$("<label />")
					.text(columns[i].name)
					.prepend($input)
					.appendTo($li);
			}

			$("<hr/>").appendTo($menu);
			$li = $("<li />").appendTo($menu);
			$input = $("<input type='checkbox' />").data("option", "autoresize");
			$("<label />")
				.text("Force fit columns")
				.prepend($input)
				.appendTo($li);
			if (grid.getOptions().forceFitColumns) {
				$input.attr("checked", "checked");
			}

			$li = $("<li />").appendTo($menu);
			$input = $("<input type='checkbox' />").data("option", "syncresize");
			$("<label />")
				.text("Synchronous resize")
				.prepend($input)
				.appendTo($li);
			if (grid.getOptions().syncColumnCellResize) {
				$input.attr("checked", "checked");
			}

			$menu
				.css("top", e.pageY - 10)
				.css("left", e.pageX - 10)
				.fadeIn(options['fadeSpeed']);
		}

		function updateColumn(e) {
			if ($(e.target).data("option") == "autoresize") {
				if (e.target.checked) {
					grid.setOptions({forceFitColumns: true});
					grid.autosizeColumns();
				} else {
					grid.setOptions({forceFitColumns: false});
				}
				return;
			}

			if ($(e.target).data("option") == "syncresize") {
				if (e.target.checked) {
					grid.setOptions({syncColumnCellResize: true});
				} else {
					grid.setOptions({syncColumnCellResize: false});
				}
				return;
			}

			// 2014.05.14 jonR  Curious. jQuery parse error, only if compiled.
			// uncompiled, e.target.innerHTML has value innerHTML: "<input type="checkbox" checked="checked">Description"
			// outerHTML: "<label><input type="checkbox" checked="checked">Description</label>"

			// Can we use that to tell if a checkbox, and if is, is it checked?
			// or this: span.slick-columnpicker has  innerHTML: "<li><label><input type="checkbox" checked="checked"></label></li>....<li>...
			// single quotes did not help. Doing it the dumb way works.
			var kind = jQuery(e.target).attr('type');
			if (kind ==="checkbox"){
			//if ($(e.target).is(":checkbox")) {
				var visibleColumns = [];
				$.each(columnCheckboxes, function(i, e) {
					// do not see a good alternative for this.
					var kind2 = jQuery(this).attr('checked');
					if (kind2 ==="checked"){
						// if ($(this).is(":checked")) {
						visibleColumns.push(columns[i]);
					}
				});

				if (!visibleColumns.length) {
					$(e.target).attr("checked", "checked");
					return;
				}
				// Note the algorithm. If you touch any checkbox, then immediately run through all the check box elements
				// pushing columns into array, then setColumns.
				grid.setColumns(visibleColumns);
			}
		}


		init();
	}

	// Slick.Controls.ColumnPicker
	$.extend(true, window, { 'Slick': { Controls: { ColumnPicker: SlickColumnPicker }}});
})(jQuery);
