goog.provide('codeshelf.ledcontrollers.service');
goog.require('codeshelf.websession');
goog.require('codeshelf.sessionGlobals');
goog.require('domainobjects');


/**
 * @constructor
 *  @ngInject
 *  @export
 */
codeshelfApp.LedControllerService = function($q, websession) {
  this.websession_ = websession;
  this.q_ = $q;
  this.facility_ = codeshelf.sessionGlobals.getFacility();
};

codeshelfApp.LedControllerService.prototype.getLedControllers = function() {
	var deferred = this.q_.defer();
	// ledController parent is codeshelf_network, whose parent is the facility
	var ledControllerFilter = 'ledControllersByFacility';

	var ledControllerFilterParams = [
		{ 'name': 'facilityId', 'value': this.facility_["persistentId"] }
	];

	var className = domainobjects['LedController']['className'];
	var propertyNames = Object.keys(domainobjects['LedController']['properties']);

	var setListViewFilterCmd = this.websession_.createRegisterFilterRequest(className,propertyNames,ledControllerFilter,ledControllerFilterParams);
	this.websession_.sendCommand(setListViewFilterCmd,this.filterResponseCallback_(deferred),true);
	return deferred.promise;
};

codeshelfApp.LedControllerService.prototype.filterResponseCallback_ = function(deferred){
	var callback = {
		exec: function(type, command) {
			if (type == kWebSessionCommandType.OBJECT_FILTER_RESP) {
				deferred.resolve(command['results']);
			}
		}
	};
	return callback;
};
angular.module('codeshelfApp').service('ledcontrollers', ['$q', 'websession', codeshelfApp.LedControllerService]);
