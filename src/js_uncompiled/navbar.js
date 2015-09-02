goog.provide("codeshelf.navbar");
goog.require("codeshelf.authz");
goog.require("goog.soy");

/**
 * @constructor
 */
codeshelf.Navbar = function() {
    this.navbar_ = [
        {"key": "operations",
         "label": "Operations",
         "menu": [
         /**
          *   Orders views no long allowed. Not efficient enough when there are thousands of orders
             {"href": "javascript:launchOrdersView('27')", key: "orders.outbound", "label": "Outbound Orders", "permission": "order:view:outbound"},
             // Need to do next line conditionally. Do it for GoodEggs. Don't for Accu-Logistics
             {"href": "javascript:launchBatchOrdersView()", key: "orders.crossbatch", "label": "Cross Batch Orders", "permission": "order:view:crossbatch"},
          */

             {"href": "javascript:launchOrderDetailsView()", key: "orders.details", "label": "Order Details", "permission": "order:view:details"},
             {"href": "javascript:launchContainerUseListView()", key: "containers", "label": "Containers", "permission" : "container:view" },
             {"href": "javascript:launchWorkInstructionListView()", key: "workinstructions", "label": "Uncompleted Work Instructions", "permission" : "workinstructions:view" }
        ]},

        {"key": "inventory",
         "label": "Inventory",
         "menu": [
        	 {"href": "javascript:launchInventoryView()", key: "inventory", "label": "Item Locations", "permission":"inventory:view"},
             {"href": "javascript:launchItemMastersView()", key: "itemmasters", "label": "Item Masters", "permission":"itemmasters:view"},
             {"href": "javascript:launchGtinView()", key: "gtins", "label": "Items by GTIN", "permission":"gtins:view"}
         ]},

        {"key": "places",
         "label": "Places",
         "menu": [
             {"href": "javascript:launchCheListView()", key: "che", "label": "CHE",  "permission": "che:view" },
             {"href": "javascript:launchAislesListView()", key: "aisles.list", "label": "Aisles List", "permission": "aisle:view"  },
             {"href": "javascript:launchBayListView()", key: "bays.list", "label": "Bays List", "permission": "bay:view" },
             {"href": "javascript:launchTierListView()", key: "tiers.list", "label": "Tiers List", "permission": "tier:view"},
             {"href": "javascript:launchSlotListView()", key: "slots.list", "label": "Slots List", "permission": "slot:view"}
         ]},

        {"key": "configure",
         "label": "Configure",
         "menu": [
             {"href": "javascript:doFacilityNameDialog()", key: "facility.setname", "label": "Edit Facility", "permission": "facility:edit"},
             {"href": "javascript:launchFacilityEditor()", key: "facility.outline", "label": "Facility Outline", "permission": "facility:edit" },
             {"href": "javascript:launchLedControllersListView()", key: "ledControllers.list", "label": "LED Controllers List", "permission": "ledController:view" },
             {"href": "javascript:launchWorkAreaEditor()", key: "workarea.editor", "label": "Work Area Editor",  "permission": "workArea:edit"},
             {"href": "javascript:launchPathsView()", key: "paths.list", "label": "Paths List", "permission": "path:view" },
             {"href": "javascript:launchLocationAliasesListView()", key: "locationAlias.list", "label": "Location Aliases", "permission": "locationAliases:view" },
             {"href": "javascript:launchDomainObjectPropertiesView()", key: "configs.list", "label": "Config Parameters", "permission": "config:edit" }
         ]},

        {"key": "help",
         "label": "Help",
         "menu": [
             {"href": "javascript:contactWasSelected()", key: "contact", "label": "Contact Codeshelf" },
             {"divider": true},
             {"href": "javascript:launchDebugWindow()", key: "debugWindow", "label": "Show Debug Window" },
             {"href": "javascript:launchTestRunner()", key: "debugtests", "label": "Debug Tests", "permission": "demo" }
         ]}
    ];
};

codeshelf.Navbar.prototype.getNavbarItems = function(facility, authz, configValues) {
    if (typeof(configValues)=== 'undefined') configValues = [];
	var navbarMenus = this.getMenuItems(this.navbar_, facility, configValues);
    var navbarItems = this.toFacilityNavbar(navbarMenus, facility);
	navbarItems = this.toInventoryNavbar(navbarMenus, configValues);
	navbarItems = this.toUserNavbar(navbarItems, authz);
    return navbarItems;
};

codeshelf.Navbar.prototype.getMenuItems = function(navbarMenus, facility, configValues) {
	// Now always have the inventory menu with ItemMaster and GTIN. The only decision is whether to have the Inventory Items.
	// Might want more user level control of this later.
	return this.filterNavbarMenus(navbarMenus, function(menu) {
		return true;

	});
};

codeshelf.Navbar.prototype.toFacilityNavbar = function(navbarItems, facility) {
    return this.filterNavbar(navbarItems, function(item) {

        if (item['key'] == 'orders.crossbatch') {
            if (!facility['hasCrossBatchOrders']) {
                return false;
            }
            else {
                return true;
            }
        } else {
            return true;
        }

    });
};

codeshelf.Navbar.prototype.toInventoryNavbar = function(navbarItems, configValues) {
	var showInvMenu = false;
	for(var i=0; i<configValues.length; i++){

		if (configValues[i].name == 'INVTMENU') {
			if (configValues[i].value == "false") {
				showInvMenu = false;
			} else {
				showInvMenu = true;
			}
			break;
		}
	}
	return this.filterNavbar(navbarItems, function(item) {

		if (item['key'] == 'inventory') {
			if (!showInvMenu) {
				return false;
			}
			else {
				return true;
			}
		} else {
			return true;
		}

	});
};


/**
 * @param {codeshelf.Authz} authz
 */
codeshelf.Navbar.prototype.toUserNavbar = function(navbarItems, authz) {
    return this.filterNavbar(navbarItems, function(item) {
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
};

codeshelf.Navbar.prototype.filterNavbarMenus = function(navbarMenus, filterFunc) {
	var userNavbar = goog.array.clone(navbarMenus);
	userNavbar  = goog.array.filter(navbarMenus, filterFunc);
    return userNavbar;
};

codeshelf.Navbar.prototype.filterNavbar = function(navbarItems, filterFunc) {
    var userNavbar = goog.array.clone(navbarItems);
    for(var i = 0; i < userNavbar.length; i++) {
        var menuItems = goog.array.clone(userNavbar[i].menu);
        userNavbar[i].menu = goog.array.filter(menuItems, filterFunc);
    }
    return userNavbar;

};
