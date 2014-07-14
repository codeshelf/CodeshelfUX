goog.provide("codeshelf.navbar");
goog.require("codeshelf.authz");
goog.require("goog.soy");

codeshelf.Navbar = function() {
	this.navbar = [
		{"key": "operations",
		 "label": "Operations",
		 "menu": [
			 {"href": "javascript:launchOrdersView()", "label": "Outbound Orders", "permission": "order:view:outbound"},

             // Need to do next line conditionally. Do it for GoodEggs. Don't for Accu-Logistics
			 {"href": "javascript:launchBatchOrdersView()", "label": "Cross Batch Orders", "permission": "order:view:crossbatch"},

			 {"href": "javascript:launchWorkAreaView()", "label": "Work Areas", "permission": "workaread:view" },
			 {"href": "javascript:l{aunchContainerUseListView()", "label": "Containers", "permission" : "container:view" },
			 {"href": "javascript:launchWorkInstructionListView()", "label": "All Work Instructions", "permission" : "workinstructions:view" },
			 {"href": "javascript:launchInventoryView()", "label": "Inventory", "permission":"inventory"}
		 ]
		},
		{"key": "places",
		 "label": "Places",
		 "menu": [
			 {"href": "javascript:launchCheListView()", "label": "CHE",  "permission": "che:view" },
			 {"href": "javascript:launchAislesListView()", "label": "Aisles List", "permission": "aisle:view"  },
			 {"href": "javascript:launchBayListView()", "label": "Bays List", "permission": "bay:view" },
			 {"href": "javascript:launchTierListView()", "label": "Tiers List", "permission": "tier:view"}

		 ]},

		{"key": "configure",
		 "label": "Configure",
		 "menu": [
			 {"href": "javascript:doFacilityNameDialog()", "label": "Set Facility Name", "permission": "facility:edit"},
			 {"href": "javascript:launchFacilityEditor()", "label": "Facility Outline", "permission": "facility:edit" },
			 {"href": "javascript:launchEdiServicesView()", "label": "EDI Services", "permission": "edi:edit" },
			 {"href": "javascript:launchLedControllersListView()", "label": "LED Controllers List", "permission": "ledController:view" },
			 {"href": "javascript:launchWorkAreaEditor()", "label": "Work Area Editor",  "permission": "workArea:edit"},
			 {"href": "javascript:launchPathsView()", "label": "Paths List", "permission": "path:view" }
		 ]},

		{"key": "help",
		 "label": "Help",
		 "menu": [
			 {"href": "javascript:contactWasSelected()", "label": "Contact Codeshelf" },
			 {"divider": true},
			 {"href": "javascript:prototypeAndTest()", "label": "Prototype and Test", "disabled": true , "permission": "demo"},
			 {"href": "javascript:launchListViewDemo()", "label": "List View Demo", "permission": "demo" },
			 {"href": "javascript:launchTestRunner()", "label": "Debug Tests", "permission": "demo" }
		 ]}
	];
};

/**
 * @param {codeshelf.Authz} authz
 */
codeshelf.Navbar.prototype.toUserNavbar = function(authz) {
	var userNavbar = goog.array.clone(this.navbar);

	for(var i = 0; i < userNavbar.length; i++) {
		var menuItems = goog.array.clone(userNavbar[i].menu);
		userNavbar[i].menu = goog.array.filter(menuItems, function(item) {
			var permitted = false;

			if (typeof item['permission'] !== 'undefined') {
				var permissionToCheck = item['permission'];
				permitted =  authz.hasPermission(permissionToCheck);
			}
			else {
				permitted = true;
			}
			return permitted;
		});
	}
	return userNavbar;
};
