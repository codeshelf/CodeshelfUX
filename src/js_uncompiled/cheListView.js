/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2014, Jeffrey B. Williams, All rights reserved
 *
 *******************************************************************************/
/*
file cheListView.js author jon ranstrom
 */
goog.provide('codeshelf.chelistview');
goog.require('codeshelf.hierarchylistview');
goog.require('codeshelf.templates');
goog.require('codeshelf.contextmenu');
goog.require('codeshelf.view');
goog.require('codeshelf.dateformat');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.ui.tree.TreeControl');


/**
 * The aisles for this facility.
 * @param websession The websession used for updates.
 * @param facility The facility to check.
 * @return {Object} The aisles list view.
 */
codeshelf.cheslistview = function(websession, facility) {

    var websession_ = websession;
    var facility_ = facility; // defined above so it available to testOnlySetUpChe

    function websocketCmdCallbackFacility() {
        var callback = {
            exec: function(command) {
                /* appears to never be called
                var theLogger = goog.debug.Logger.getLogger('aislesListView');
                theLogger.info("callback exec called"); */
            }
        };

        return callback;
    }

    var self = {

        // following psuedo-inheritance
        'shouldAddThisColumn': function(inProperty){
            // only fields in domainObjects for aisle will be asked for. We want to exclude persistent Id
            if (inProperty['id'] ===  'domainId')
                return true;
            else if (inProperty['id'] ===  'activeContainers')
                return true;
            else if (inProperty['id'] ===  'color')
                return true;
            else if (inProperty['id'] ===  'deviceGuidStr')
                return true;
            else
                return false;
        },

        'getViewName': function() {
            return 'CHE List View';
        },

        'getViewMenu': function() {
            return [
                {"label": 'Export CSV', "action": function() {self.generateCSV();} }
                ,{"label": 'Add CHE', "action": function() {self.addChe({});}, "permission": "che: edit" }
            ];
        },
        addChe:  function(){
            var data = {
                'che': {},
                'facility':facility,
                'mode': "add"
            };

            // See codeshelfApp.CheController defined below. And then referenced in angular.module
            var promise = codeshelf.simpleDlogService.showCustomDialog("partials/change-che.html", "CheNgController as controller", data);

            promise.result.then(function(){

            });
        },

        editChe:  function(che){
            var data = {
                'che': che,
                'mode': "edit"
            };

            var theLogger = goog.debug.Logger.getLogger('CHE view');
            theLogger.info("about to call dialog for selected CHE: " + che['domainId']);


            // See codeshelfApp.CheController defined below. And then referenced in angular.module
            var promise = codeshelf.simpleDlogService.showCustomDialog("partials/change-che.html", "CheNgController as controller", data);

            promise.result.then(function(){

            });
        },

		deleteChe: function(che) {
			codeshelf.simpleDlogService.showModalDialog("Confirm", "Delete the che?", {})
            	.then(function() {
					websession_.callServiceMethod("UiUpdateBehavior", 'deleteChe', [che['persistentId']]);
               	});
       	},

       	cheContainers: function(che) {
            if (che === null)
                return;
            if (che) {
                var useListView = codeshelf.containeruselistview(codeshelf.sessionGlobals.getWebsession(), codeshelf.sessionGlobals.getFacility(), che);
                var useListWindow = codeshelf.window(useListView, codeshelf.sessionGlobals.getDomNodeForNextWindow(), codeshelf.sessionGlobals.getWindowDragLimit());
                useListWindow.open();
            }
    	},

        // This is the ALL work instructions for CHE item
        cheWorkInstructions: function(che) {
            if (che === null)
                return;
            if (che) {
                var wiListView = codeshelf.workinstructionByCheAll(codeshelf.sessionGlobals.getWebsession(), codeshelf.sessionGlobals.getFacility(), che);
                var wiListWindow = codeshelf.window(wiListView, codeshelf.sessionGlobals.getDomNodeForNextWindow(), codeshelf.sessionGlobals.getWindowDragLimit());
                wiListWindow.open();
            }
        },

        testOnlySetUpChe: function(che) {
            if (che === null)
                return;

            var data = {
                'che': che
            };

            var cheDomainId = che['domainId'];
            var theLogger = goog.debug.Logger.getLogger('CHE view');
            theLogger.info("about do a fake GoodEggs setup for CHE: " + cheDomainId);

            // See codeshelfApp.CheController defined below. And then referenced in angular.module
            var promise = codeshelf.simpleDlogService.showCustomDialog("partials/setup-che.html", "SetupCheNgController as controller", data);

            promise.result.then(function(){
            });
        },
        
        showPreviousCartRun: function(che, summaries) {
            var data = {
                "che": che,
                "summaries": summaries
            };
            var promise = codeshelf.simpleDlogService.showCustomDialog("partials/wisummary-che.html", "CheWiSummaryController as controller", data);
            return promise;
        },
        
        showWisForDay: function(che, summaries) {
            var data = {
                "che": che,
                "summaries": summaries
            };
            var promise = codeshelf.simpleDlogService.showCustomDialog("partials/wibyday-che.html", "CheWiByDayController as controller", data);
            return promise;
        },

		posConSetup: function(che) {
			codeshelf.simpleDlogService.showModalDialog("Confirm", "Reset and assign position controllers?", {})
            	.then(function() {
					websession_.callServiceMethod("UiUpdateBehavior", 'posConSetup', [che['persistentId'], true]);
               	});
       	},

       	posConLightAddresses: function(che) {
			websession_.callServiceMethod("UiUpdateBehavior", 'posConLightAddresses', [che['persistentId'], true]);
       	}
    };

    var contextDefs = [
        {
            "label": "Work Instructions (CHE runs)",
            "permission": "workinstructions:view",
            "action": function(che) {
                websession_.callServiceMethod("WorkBehavior", "workAssignedSummary", [che ['persistentId'], facility_ ['persistentId']])
                    .then(function(summaries) {
                        return self.showPreviousCartRun(che, summaries);
                    });
            }
        },
        {
            "label": "Work Instructions (by day)",
            "permission": "workinstructions:view",
            "action": function(che) {
                websession_.callServiceMethod("WorkBehavior", "workCompletedSummary", [che ['persistentId'], facility_ ['persistentId']])
                    .then(function(summaries) {
                        return self.showWisForDay(che, summaries);
                    });
            }
        },
        {   // Change to a model similar to CHE runs. Initially a simple filter of all WI for the CHE
            // Rename the label "Work Instruction (by day)"
            "label": "Work Instructions (all)",
            "permission": "workinstructions:view",
            "action": function(che) {
                self.cheWorkInstructions(che);
            }
        },
        {
            "label": "Containers",
            "permission": "containers:view",
            "action": function(che) {
                self.cheContainers(che);
            }
        },
        {
            "label": "Edit CHE",
            "permission": "che:edit",
            "action": function(che) {
                self.editChe(che);
            }
        },
        {
            "label": "Delete CHE",
            "permission": "che:edit",
            "action": self.deleteChe
        },
        {
            "label": "PosCon Setup",
            "permission": "che:edit",
            "action": self.posConSetup
        },
        {
            "label": "PosCon Light Addresses",
            "permission": "ux:view",
            "action": self.posConLightAddresses
        },
        {
            "label": "TESTING ONLY--Simulate cart set up",
            "permission": "che:simulate",
            "action": function(che) {
                self.testOnlySetUpChe(che);
            }
        }

    ];

    // che parent is codeshelf_network, whose parent is the facility
    var cheFilter = 'cheByFacility';

    var cheFilterParams = [
        { 'name': 'facilityId', 'value': facility_['persistentId']}
    ];

    var hierarchyMap = [];
    hierarchyMap[0] = { "className": domainobjects['Che']['className'],
                        "linkProperty": 'parent',
                        "filter" : cheFilter,
                        "filterParams" : cheFilterParams,
                        "properties": domainobjects['Che']['properties'],
                        "contextMenuDefs": contextDefs};

    var viewOptions = {
        'editable':  true,
        // -1 for non-dragable. Single level view with normal sort rules
        'draggableHierarchyLevel': -1
    };

    var view = codeshelf.hierarchylistview(websession_, domainobjects['Che'], hierarchyMap, viewOptions);
    jQuery.extend(view, self);
    self = view;
    return view;
};

// check not-null, and not empty. Does not check for only white space.
function isEmptyString(str) {
    return (!str || 0 === str.length);
}

codeshelfApp.filter("currentOrDate", function() {
    return function(summary) {
        if (summary['active']) {
            return "Current";
        }
        else {
            return codeshelf.conciseDateTimeFormat(summary['assignedTime']);
        }
    };
});

codeshelfApp.filter("byDayFormat", function() {
    return function(summary) {
        return codeshelf.conciseDateFormat(summary['assignedTime']);
    };
});

/**
 *  @param {!angular.Scope} $scope
 *  @param  $modalInstance
 *  @param  data
 *  @constructor
 *  @ngInject
 *  @export
 */
codeshelfApp.AbstractCheController = function($scope, $modalInstance, websession, data) {
    this.scope_ = $scope;
    this.modalInstance_ = $modalInstance;
    this.websession_ = websession;
    $scope['che'] = data['che'];
};

/**
 * @export
 */
codeshelfApp.AbstractCheController.prototype.cancel = function(){
    this.modalInstance_['dismiss'](); //not sure why this minifies but close() does not
};

codeshelfApp.AbstractCheController.prototype.close = function(){
    this.modalInstance_.close();
}


/**
 *  @param {!angular.Scope} $scope
 *  @param  $modalInstance
 *  @constructor
 *  @ngInject
 *  @export
 *  @extends {codeshelfApp.AbstractCheController}
 */
codeshelfApp.CheWiSummaryController = function($scope, $modalInstance, websession, data){
    goog.base(this, $scope, $modalInstance, websession, data);
    $scope['form'] = {
        "summaries" : data['summaries'],
        "summary" : data['summaries'][0]
    };
};
goog.inherits(codeshelfApp.CheWiSummaryController, codeshelfApp.AbstractCheController);

/**
 * @export
 */
codeshelfApp.CheWiSummaryController.prototype.ok = function(){
    var che = this.scope_['che'];
    var summary = this.scope_['form']['summary'];
    var wiListView = codeshelf.workinstructionByCheAndAssignedTimestamp(codeshelf.sessionGlobals.getWebsession(), codeshelf.sessionGlobals.getFacility(), che, summary['assignedTime']);
    var wiListWindow = codeshelf.window(wiListView, codeshelf.sessionGlobals.getDomNodeForNextWindow(), codeshelf.sessionGlobals.getWindowDragLimit());
    wiListWindow.open();
    this.close();
};
angular.module('codeshelfApp').controller('CheWiSummaryController', ['$scope', '$modalInstance',  'websession','data', codeshelfApp.CheWiSummaryController]);


/**
 *  @param {!angular.Scope} $scope
 *  @param  $modalInstance
 *  @constructor
 *  @ngInject
 *  @export
 *  @extends {codeshelfApp.AbstractCheController}
 */
codeshelfApp.CheWiByDayController = function($scope, $modalInstance, websession, data){
    goog.base(this, $scope, $modalInstance, websession, data);
    $scope['form'] = {
        "summaries" : data['summaries'],
        "summary" : data['summaries'][0]
    };
};
goog.inherits(codeshelfApp.CheWiByDayController, codeshelfApp.AbstractCheController);

/**
 * @export
 */
codeshelfApp.CheWiByDayController.prototype.ok = function(){
    var che = this.scope_['che'];
    var summary = this.scope_['form']['summary'];
    var wiListView = codeshelf.workinstructionByCheAndDay(codeshelf.sessionGlobals.getWebsession(), codeshelf.sessionGlobals.getFacility(), che, summary['assignedTime']);
    var wiListWindow = codeshelf.window(wiListView, codeshelf.sessionGlobals.getDomNodeForNextWindow(), codeshelf.sessionGlobals.getWindowDragLimit());
    wiListWindow.open();
    this.close();
};
angular.module('codeshelfApp').controller('CheWiByDayController', ['$scope', '$modalInstance',  'websession','data', codeshelfApp.CheWiByDayController]);


/**
 *  @param {!angular.Scope} $scope
 *  @param  $modalInstance
 *  @constructor
 *  @ngInject
 *  @export
 *  @extends {codeshelfApp.AbstractCheController}
 */
codeshelfApp.CheNgController = function($scope, $modalInstance, websession, data){
    goog.base(this, $scope, $modalInstance, websession, data);
    $scope['mode'] = data["mode"];
    $scope['facility'] = data['facility'];
    // tweaking separate fields
    // first has html/angular scope matching js field.
    $scope['che']['description'] = data['che']['description'];
    $scope['che']['color'] = data['che']['color'];
    // second could match. Just being different to practice for when we have to be different
    $scope['che']['domainid'] = data['che']['domainId'];
    $scope['che']['cntrlrid'] = data['che']['deviceGuidStr'];
    //Set Process Mode
    var processMode = data['che']['processMode'];
    $scope['che']['processMode'] = (processMode == undefined)?"LINE_SCAN" : processMode;
    if (processMode == undefined) {
        var methodArgs = [data['che']['persistentId']];
        websession.callServiceMethod("UiUpdateBehavior", 'getDefaultProcessMode', methodArgs)
            .then(function(response) {
                $scope['che']['processMode'] = response;
                $scope.$apply();
            });
    }
    //Set Scanner Type
    var scannerType = data['che']['scannerType'];
    $scope['che']['scannerType'] = (scannerType == undefined)?"ORIGINALSERIAL" : scannerType;
    //Set Che Lighting Type
    var cheLighting = data['che']['cheLighting'];
    $scope['che']['cheLighting'] = (cheLighting == undefined)?"POSCON_V1" : cheLighting;
};
goog.inherits(codeshelfApp.CheNgController, codeshelfApp.AbstractCheController);


/**
 * @export
 */
codeshelfApp.CheNgController.prototype.edit = function(){
    var che = this.scope_['che'];
    var methodArgs = [che["persistentId"], che["domainid"], che["description"], che["color"], che["cntrlrid"], che["processMode"], che["scannerType"], che["cheLighting"]];
    var self = this;
    this.websession_.callServiceMethod("UiUpdateBehavior", 'updateChe', methodArgs)
        .then(function(response) {
            self.close();
        }, function(error) {
            self.scope_['cheForm'] = {"messages":[error["statusMessage"]]};
            self.scope_.$apply();
            console.error(error);
        });
};

/**
 * @export
 */
codeshelfApp.CheNgController.prototype.add = function(){
    var che = this.scope_['che'];
    var facilityPersistentId =  this.scope_['facility']['persistentId'];
    var methodArgs = [ facilityPersistentId, che["domainid"], che["description"], che["color"], che["cntrlrid"], che["processMode"], che["scannerType"], che["cheLighting"]];
    var self = this;
    this.websession_.callServiceMethod("UiUpdateBehavior", 'addChe', methodArgs)
        .then(function(response) { //onsuccess
            self.close();
        }, function(error) {
            self.scope_['cheForm'] = {"messages":[error["statusMessage"]]};
            self.scope_.$apply();
            console.error(error);
        });
};



angular.module('codeshelfApp').controller('CheNgController', ['$scope', '$modalInstance', 'websession', 'data', codeshelfApp.CheNgController]);


//**************** Different dialog for simulating cart setup *****************

/**
 *  @param {!angular.Scope} $scope
 *  @param  $modalInstance
 *  @constructor
 *  @ngInject
 *  @export
 *  @extends {codeshelfApp.AbstractCheController}
 */
codeshelfApp.SetupCheNgController = function($scope, $modalInstance, websession, data){
    goog.base(this, $scope, $modalInstance, websession, data);
    $scope['che']['containersOnChe'] = data['che']['containersOnChe'];
};
goog.inherits(codeshelfApp.SetupCheNgController, codeshelfApp.AbstractCheController);


/**
 * @export
 */
codeshelfApp.SetupCheNgController.prototype.ok = function(){
    var che = this.scope_['che'];
    var containersProperty = "containersOnChe";

    if (!isEmptyString(che[containersProperty])) {
        var dialog = this;
        this.websession_.callServiceMethod("WorkBehavior", 'fakeSetupUpContainersOnChe', [che['persistentId'],
                                                                                         che[containersProperty]]).
            then(function() {
                dialog.close();
            });
    }
};
angular.module('codeshelfApp').controller('SetupCheNgController', ['$scope', '$modalInstance', 'websession', 'data', codeshelfApp.SetupCheNgController]);

//  LocalWords:  deleteChe
