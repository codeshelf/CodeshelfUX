/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2014, Jeffrey B. Williams, All rights reserved
 *
 *******************************************************************************/
/*
File sitecontrollerlistview.js author Ilya Landa
 */
goog.provide('codeshelf.sitecontrollerlistview');
goog.require('codeshelf.hierarchylistview');
goog.require('codeshelf.templates');
goog.require('codeshelf.contextmenu');
goog.require('codeshelf.view');
goog.require('codeshelf.dateformat');
goog.require('codeshelf.networks.service');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.ui.tree.TreeControl');


/**
 * The site controllers for this facility.
 * @param websession The websession used for updates.
 * @param facility The facility to check.
 * @return {Object} The aisles list view.
 */
codeshelf.sitecontrollerlistview = function(websession, facility) {

    var websession_ = websession;
    var facility_ = facility;

    function websocketCmdCallbackFacility() {
        var callback = {
            exec: function(command) {
            }
        };

        return callback;
    }

    var self = {

        // following psuedo-inheritance
        'shouldAddThisColumn': function(inProperty){
            // only fields in domainObjects for aisle will be asked for. We want to exclude persistent Id
            if (inProperty['id'] === 'domainId')
                return true;
            else if (inProperty['id'] === 'userExists')
                return true;
            else if (inProperty['id'] === 'location')
                return true;
            else if (inProperty['id'] === 'roleUi')
                return true;
            else if (inProperty['id'] === 'networkDomainId')
                return true;
            else if (inProperty['id'] === 'channelUi')
                return true;
            else
                return false;
        },

        'getViewName': function() {
            return 'Site Controllers List';
        },

        'getViewMenu': function() {
            return [
                {"label": 'Export CSV', "action": function() {self.generateCSV();} },
                {"label": 'Add Site Controller', "action": function() {self.addSiteController({});}, "permission": "facility: edit" }
            ];
        },
        addSiteController:  function(){
            var data = {
                'siteController': {},
                'facility':facility,
                'mode': "add"
            };

            var promise = codeshelf.simpleDlogService.showCustomDialog("partials/change-sitecontroller.html", "SiteControllerNgController as controller", data);
            promise.result.then(function(){
            });
        },

        editSiteController:  function(siteController){
            var data = {
                'siteController': siteController,
                'facility':facility,
                'mode': "edit"
            };

            var promise = codeshelf.simpleDlogService.showCustomDialog("partials/change-sitecontroller.html", "SiteControllerNgController as controller", data);
            promise.result.then(function(){
            });
        },

		deleteSiteController: function(siteController) {
			codeshelf.simpleDlogService.showModalDialog("Confirm", "Delete Site Controller?", {})
            	.then(function() {
					websession_.callServiceMethod("UiUpdateBehavior", 'deleteSiteController', [siteController['persistentId']]);
               	});
       	},
        
		makePrimaryForNetwork: function(siteController) {
			var prompt = "Make Site Controller " + siteController['domainId'] + " primary on network " + siteController['networkDomainId'] + "? Site Controllers on that network will restart.";
			codeshelf.simpleDlogService.showModalDialog("Confirm", prompt, {})
            	.then(function() {
            		websession_.callServiceMethod("UiUpdateBehavior", 'makeSiteControllerPrimaryForNetwork', [siteController['persistentId']]);
               	});
       	},
       	
		restartSiteController: function(siteController) {
			codeshelf.simpleDlogService.showModalDialog("Confirm", "Restart Site Controller?", {})
            	.then(function() {
					websession_.callServiceMethod("UiUpdateBehavior", 'restartSiteController', [siteController['persistentId']]);
               	});
       	}
    };

    var contextDefs = [
        {
           "label": "Restart Site Controller",
           "permission": "facility:edit",
           "action": self.restartSiteController
        },
        {
            "label": "Make Site Controller Primary For Network",
            "permission": "facility:edit",
            "action": self.makePrimaryForNetwork
        },
        {
            "label": "Edit Site Controller",
            "permission": "facility:edit",
            "action": self.editSiteController
        },
        {
            "label": "Delete Site Controller",
            "permission": "facility:edit",
            "action": self.deleteSiteController
        }
    ];

    // Site Controller parent is codeshelf_network, whose parent is the facility
    var siteCntrollerFilter = 'siteControllersByFacility';
    var siteCntrollerFilterParams = [
		{ 'name': 'facilityId', 'value': facility_['persistentId']}
    ];

    var hierarchyMap = [];
    hierarchyMap[0] = { "className": domainobjects['SiteController']['className'],
                        "linkProperty": 'parent',
                        "filter" : siteCntrollerFilter,
                        "filterParams" : siteCntrollerFilterParams,
                        "properties": domainobjects['SiteController']['properties'],
                        "contextMenuDefs": contextDefs};

    var viewOptions = {
        'editable':  true,
        // -1 for non-dragable. Single level view with normal sort rules
        'draggableHierarchyLevel': -1
    };

    var view = codeshelf.hierarchylistview(websession_, domainobjects['SiteController'], hierarchyMap, viewOptions);
    jQuery.extend(view, self);
    self = view;
    return view;
};

/**
 *  @param {!angular.Scope} $scope
 *  @param  $modalInstance
 *  @constructor
 *  @ngInject
 *  @export
 */
codeshelfApp.SiteControllerNgController = function($scope, $modalInstance, websession, data, networksservice){
	this.scope_ = $scope;
    this.modalInstance_ = $modalInstance;
    this.websession_ = websession;
    $scope['siteController'] = data['siteController'];
    $scope['mode'] = data["mode"];
    $scope['facility'] = data['facility'];
    // tweaking separate fields
    // first has html/angular scope matching js field.
    $scope['siteController']['domainId'] = data['siteController']['domainId'];
    $scope['siteController']['location'] = data['siteController']['location'];
    $scope['siteController']['networkDomainId'] = data['siteController']['networkDomainId'];
    //Fill Networks dropdown
    networksservice.getNetworks().then(function(networks) {
		$scope['networks'] = networks;
	});
    //Select Networks
    var network = data['siteController']['networkDomainId'];
    if (network == undefined) {
    	var methodArgs = [data['facility']['persistentId']];
        websession.callServiceMethod("UiUpdateBehavior", 'getDefaultFacilityNetwork', methodArgs)
        .then(function(network) {
            $scope['siteController']['networkDomainId'] = network['domainId'];
            $scope.$apply();
        });    	
    } else {
    	$scope['siteController']['networkDomainId'] = network;
    }
};

/**
 * @export
 */
codeshelfApp.SiteControllerNgController.prototype.cancel = function(){
    this.modalInstance_['dismiss']();
};

/**
 * @export
 */
codeshelfApp.SiteControllerNgController.prototype.edit = function(){
    var siteController = this.scope_['siteController'];
    var methodArgs = [siteController["persistentId"], siteController["domainId"], siteController["location"], siteController["networkDomainId"]];
    var self = this;
    this.websession_.callServiceMethod("UiUpdateBehavior", 'updateSiteController', methodArgs)
        .then(function(response) {
            self.cancel();
        }, function(error) {
        	self.scope_.$apply(function() {
				self.scope_['response'] = error;
			});
        });
};

/**
 * @export
 */
codeshelfApp.SiteControllerNgController.prototype.add = function(){
    var siteController = this.scope_['siteController'];
    var facilityPersistentId =  this.scope_['facility']['persistentId'];
    var methodArgs = [facilityPersistentId, siteController["domainId"], siteController["location"], siteController["networkDomainId"]];
    var self = this;
    this.websession_.callServiceMethod("UiUpdateBehavior", 'addSiteController', methodArgs)
        .then(function(response) {
            self.cancel();
        }, function(error) {
        	self.scope_.$apply(function() {
				self.scope_['response'] = error;
			});
        });
};

angular.module('codeshelfApp').controller('SiteControllerNgController', ['$scope', '$modalInstance', 'websession', 'data', 'networksservice', codeshelfApp.SiteControllerNgController]);