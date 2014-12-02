goog.provide('codeshelf.pathsegment.service');
goog.require('codeshelf.websession');
goog.require('codeshelf.sessionGlobals');
goog.require('domainobjects');


/**
 * @constructor
 *  @ngInject
 *  @export
 */
codeshelfApp.PathSegmentService = function($q, websession) {
  this.websession_ = websession;
  this.q_ = $q;
  this.facility_ = codeshelf.sessionGlobals.getFacility();
};

codeshelfApp.PathSegmentService.prototype.getPathSegments = function() {
	var deferred = this.q_.defer();
	// ledController parent is codeshelf_network, whose parent is the facility
	var filter = 'pathSegmentsByFacility';

	var filterParams = [
		{ 'name': 'facilityId', 'value': this.facility_["persistentId"] }
	];

	var className = domainobjects['PathSegment']['className'];
	var propertyNames = Object.keys(domainobjects['PathSegment']['properties']);
	var setListViewFilterCmd = this.websession_.createRegisterFilterRequest(className,propertyNames,filter,filterParams);
	this.websession_.sendCommand(setListViewFilterCmd,this.filterResponseCallback_(deferred),false);
	return deferred.promise;
};

codeshelfApp.PathSegmentService.prototype.filterResponseCallback_ = function(deferred){
	var callback = {
		exec: function(type,command) {
			if (type == kWebSessionCommandType.OBJECT_FILTER_RESP) {
				deferred.resolve(command['results']);
			}
		}
	};
	return callback;
};
angular.module('codeshelfApp').service('pathsegmentservice', ['$q', 'websession', codeshelfApp.PathSegmentService]);
