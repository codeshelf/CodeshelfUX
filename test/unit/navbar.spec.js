'use strict';

goog.require('codeshelf.navbar');

describe('navbar', function() {
	var navbar;
	var authz;
	beforeEach(function() {

		navbar = new codeshelf.Navbar();

	});

	/**
	 * Remove orders menu choices, so this test invalid
	describe("when user has all permissions", function() {
		beforeEach(function() {
			authz = new codeshelf.Authz();
			authz.setPermissions("*");

		});

		it("should not show  crossbatch nav item", function() {

			var facilityNavbar = navbar.getNavbarItems({"hasCrossBatchOrders" : false}, authz);
			expect(hasMenuItem(facilityNavbar, 'orders.crossbatch')).toBe(false);
		});

		it("should show  crossbatch nav item", function() {
			var facilityNavbar = navbar.getNavbarItems({"hasCrossBatchOrders" : true}, authz);
			expect(hasMenuItem(facilityNavbar, 'orders.crossbatch')).toBe(true);
		});
	});
	*/

	describe("when view-only user",function() {
		var filteredNavbar;
		var facility;

		beforeEach(function() {
			facility= {"hasCrossBatchOrders" : true};

			authz = new codeshelf.Authz();
			authz.setPermissions([
				"*:view"
			]);
			filteredNavbar = navbar.getNavbarItems(facility, authz);

		});

		it("navbar should contain che list", function() {
			expect(hasMenuItem(filteredNavbar, 'che')).toBe(true);
		});

		it("navbar should not contain facility editor", function() {
			expect(hasMenuItem(filteredNavbar, 'facility.outline')).toBe(false);
		});



	});


	function  hasMenuItem(filteredNavbar, key) {
		var found = false;
		for(var i = 0; i < filteredNavbar.length; i++) {
			for(var j = 0; j < filteredNavbar[i].menu.length; j++) {
				var menuItem = filteredNavbar[i].menu[j];
				if (typeof menuItem.key !== 'undefined') {
					if (menuItem.key == key) {
						found = true;
					}
				}

			}
		}
		return found;
	}
});
