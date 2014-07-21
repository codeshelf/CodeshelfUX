goog.provide("codeshelf.multilevelcomparer");
goog.require("goog.string");
goog.require("goog.array");

/**
 * @typedef {{
 *     comparer: ?Function,
 *     className: !string,
 *     properties: !Object,
 *     filter: string,
 *     filterParams: Array.<Object>,
 *     linkProperty: !string,
 *     actions: ?Object
 *  }}
 */
codeshelf.HierarchyLevel = {};

/**
 * @constructor
 * @param {Array.<codeshelf.HierarchyLevel>} hierarchyMap
 * @param {!Array} originalItems
 */
codeshelf.MultilevelComparer = function(hierarchyMap, originalItems) {
	this.hierarchyMap_ = hierarchyMap;
	this.originalItems_ = goog.array.clone(originalItems);
};

/**
 * Compare the colums from left-to-right (so that they sort left-to-right).
 * @param itemA
 * @param itemB
 * @return {!number}
 */
codeshelf.MultilevelComparer.prototype.compare =  function(itemA, itemB) {
	var itemALevel = this.getLevel(itemA);
	var itemBLevel = this.getLevel(itemB);

	var result = 0;
	//Same item - we are comparing parent of a level 0 (null parent) or we found a common parent; break out of recursion
	if ((itemA == null && itemB == null) || itemA['persistentId'] == itemB['persistentId']) {
		result = 0;
	}
	if (itemALevel <  itemBLevel) {
		var itemBParent = this.getParent(itemB, this.hierarchyMap_[itemBLevel]['linkProperty']);
		var parentResult = this.compare(itemA, itemBParent);
		if (parentResult == 0) { // found common ancestor
			result = -1; //itemA is parent
		}
		else {
			result = parentResult;
		}
	}
	else if (itemALevel > itemBLevel) {
		var itemAParent = this.getParent(itemA, this.hierarchyMap_[itemALevel]['linkProperty']);
		var parentResult =  this.compare(itemAParent, itemB);
		if (parentResult == 0) { //found common ancestor
			result = 1; //itemA is child
		}
		else {
			result =  parentResult;
		}
	}
	else if (itemALevel === itemBLevel && itemALevel != 0) { //keep going up until we find common parent, then compare
		var itemAParent = this.getParent(itemA, this.hierarchyMap_[itemALevel]['linkProperty']);
		var itemBParent = this.getParent(itemB, this.hierarchyMap_[itemBLevel]['linkProperty']);
		var parentResult = this.compare(itemAParent, itemBParent);
		if (parentResult == 0) {
			result =  this.hierarchyMap_[itemALevel]['comparer'](itemA, itemB);
		}
		else {
			result = parentResult;
		}
	} else if (itemALevel === itemBLevel && itemALevel == 0) {
		result = this.hierarchyMap_[itemALevel]['comparer'](itemA, itemB);
	}
	return result;
};

/**
 * Get the root item in the hierarchy for this item.
 * @param {!Object} item  The item where we want to get the parent.
 * @return {!string} the root item (at level) for this item.
 */
codeshelf.MultilevelComparer.prototype.getParent = function(item, linkProperty) {
	var property = linkProperty+"PersistentId";
	var idValue = item[property];
	if (idValue == null || typeof idValue === "undefined") {
		throw "full linkProperty invalid: " + property;
	}
	var foundParent = goog.array.find(this.originalItems_ , function(dataItem) {
		return dataItem['persistentId'] == idValue;
	});
	if (foundParent == null) {
		throw "item: " + item['persistentId'] + " did not have parent: " + idValue;
	}
	return foundParent;
};

/**
 * Figure our what level this item is on based on the class hierarchy.
 * @param item
 * @return {Number}  the level (0-n)
 */
codeshelf.MultilevelComparer.prototype.getLevel = function(item) {
	if (item['getLevel'] !== undefined) {
		return item['getLevel'];
	}

	for(var i = 0; i < this.hierarchyMap_.length; i++) {
			if (item['className'] === this.hierarchyMap_[i]['className']) {
				item['getLevel'] = i;
				return item['getLevel'];
			}
	}
	throw "level not found for: " + item['className'];
};
