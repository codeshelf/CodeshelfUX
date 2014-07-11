'use strict';

goog.require('codeshelf.navbar');

describe('navbar', function() {
	var navbar;
	var authz;
	beforeEach(function() {

		navbar = new codeshelf.Navbar();
	});

	describe("when view-only user",function() {
		var filteredNavbar;

		beforeEach(function() {
			authz = new codeshelf.Authz();
			authz.setPermissions([
				"*:view"
			]);
			filteredNavbar = navbar.toUserNavbar(authz);

		});

		it("navbar should contain che list", function() {
			expect(hasMenuItem(filteredNavbar, 'CHE')).toBe(true);
		});

		it("navbar should not contain facility editor", function() {
			expect(hasMenuItem(filteredNavbar, 'Facility Outline')).toBe(false);
		});



	});


	function  hasMenuItem(filteredNavbar, label) {
		var found = false;
		for(var i = 0; i < filteredNavbar.length; i++) {
			for(var j = 0; j < filteredNavbar[i].menu.length; j++) {
				var menuItem = filteredNavbar[i].menu[j];
				if (typeof menuItem.label !== 'undefined') {
					if (menuItem.label == label) {
						found = true;
					}
				}

			}
		}
		return found;
	}
});
