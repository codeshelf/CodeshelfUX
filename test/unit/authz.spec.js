'use strict';

goog.require('codeshelf.authz');

describe('authz', function() {
	var authz;
	beforeEach(function() {
		authz = new codeshelf.Authz();
	});

	describe("given multiple permissions", function() {
		beforeEach(function() {
			authz.setPermissions([
				"che:view",
				"workarea:edit"
			]);

		});

		it("exact match one", function() {
			expect(authz.hasPermission("workarea:edit")).toBe(true);
		});

		it("doesn't match a part", function() {
			expect(authz.hasPermission("che:edit")).toBe(false);
		});

	});

	describe("given a wildcard prefix", function() {
		beforeEach(function() {
			authz.setPermissions(["*:view"]); //view anything
		});

		it("passes when last part matches", function() {
			expect(authz.hasPermission("che:view")).toBe(true);
		});

		it("fails when last part does not match", function() {
			expect(authz.hasPermission("che:edit")).toBe(false);
		});

		it("passes when specific resource", function() {
			expect(authz.hasPermission("order:view:testOrderID")).toBe(true);
		});

	});
});
