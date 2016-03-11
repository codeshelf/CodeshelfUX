goog.provide('codeshelf.networks.service');
goog.require('codeshelf.websession');
goog.require('codeshelf.sessionGlobals');
goog.require('domainobjects');

/**
 * @constructor
 *  @ngInject
 *  @export
 */
codeshelfApp.NetworksService = function($q, websession) {
  this.websession_ = websession;
  this.q_ = $q;
  this.facility_ = codeshelf.sessionGlobals.getFacility();
};

codeshelfApp.NetworksService.prototype.getNetworks = function() {
	var deferred = this.q_.defer();
	// ledController parent is codeshelf_network, whose parent is the facility
	var networkFilter = 'allActiveByParent';
	var networkFilterParams = [
		{ 'name': 'parentId', 'value': this.facility_["persistentId"] }
	];

	var className = domainobjects['CodeshelfNetwork']['className'];
	var propertyNames = Object.keys(domainobjects['CodeshelfNetwork']['properties']);

	var setListViewFilterCmd = this.websession_.createRegisterFilterRequest(className,propertyNames,networkFilter,networkFilterParams);
	this.websession_.sendCommand(setListViewFilterCmd,this.filterResponseCallback_(deferred),true);
	return deferred.promise;
};

codeshelfApp.NetworksService.prototype.filterResponseCallback_ = function(deferred){
	var callback = {
		exec: function(type, command) {
			if (type == kWebSessionCommandType.OBJECT_FILTER_RESP) {
				deferred.resolve(command['results']);
			}
		}
	};
	return callback;
};
angular.module('codeshelfApp').service('networksservice', ['$q', 'websession', codeshelfApp.NetworksService]);