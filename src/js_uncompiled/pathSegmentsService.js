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
	// Luckily, ebeans can handle this form also.
	var filter = 'parent.parent.persistentId = :theId';

	var filterParams = [
		{ 'name': 'theId', 'value': this.facility_["persistentId"] }
	];

	var data = {
		'className':     domainobjects['PathSegment']['className'],
		'propertyNames': Object.keys(domainobjects['PathSegment']['properties']),
		'filterClause':  filter,
		'filterParams':  filterParams
	};

	var setListViewFilterCmd = this.websession_.createCommand(kWebSessionCommandType.OBJECT_FILTER_REQ, data);
	this.websession_.sendCommand(
		setListViewFilterCmd,
		this.filterResponseCallback_(deferred),
		true);
	return deferred.promise;
};

codeshelfApp.PathSegmentService.prototype.filterResponseCallback_ = function(deferred){
	var callback = {
		exec: function(command) {
			if (!command['data'].hasOwnProperty('results')) {
				deferred.reject('response has no result');
			} else if (command['type'] == kWebSessionCommandType.OBJECT_FILTER_RESP) {
				deferred.resolve(command['data']['results']);
			}
		}
	};
	return callback;
};
angular.module('codeshelfApp').service('pathsegmentservice', ['$q', 'websession', codeshelfApp.PathSegmentService]);
