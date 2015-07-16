goog.provide("codeshelf.multilevelcomparer");
goog.require('codeshelf.ASCIIAlphaNumericComparer');
goog.require("goog.string");
goog.require("goog.array");
goog.require("goog.json");
goog.require("goog.debug.Logger");

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
 * @param {boolean} sortAsc
 */
codeshelf.MultilevelComparer = function(hierarchyMap, originalItems, columns, sortAsc) {

	function reverse(result) { return result * -1;}

	this.logger_ = goog.debug.Logger.getLogger('codeshelf.MultilevelComparer');
	this.hierarchyMap_ = hierarchyMap;
	this.originalItems_ = goog.array.clone(originalItems);
	this.columns_ = columns;
	this.comparerAtLevel = new Array(hierarchyMap.length);
	for(var i = 0; i < hierarchyMap.length; i++) {
		var hierarchyLevel = hierarchyMap[i];
		var comparer = hierarchyLevel["comparer"];
		if (typeof comparer === "undefined") {
			comparer = this.createDefaultComparerForLevel(columns);
		}
		if (sortAsc) {
			this.comparerAtLevel[i] = comparer;
		} else {
			this.comparerAtLevel[i] = goog.functions.compose(reverse, comparer);
		}
	}
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
			result =  	this.comparerAtLevel[itemALevel](itemA, itemB);
		}
		else {
			result = parentResult;
		}
	} else if (itemALevel === itemBLevel && itemALevel == 0) {
		result = this.comparerAtLevel[itemALevel](itemA, itemB);
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
		var msg = "item: " + item['persistentId'] + " did not have parent: " + idValue + ":" + goog.json.serialize(this.originalItems_);
		throw msg;
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

	/**
     * returns a compare function by providing a getPropertiesFunc to
     *   codeshelf.grid.propertyComparer
     * @type {function(!Object, !Object)}
     */
codeshelf.MultilevelComparer.prototype.createDefaultComparerForLevel = function(columns) {
		return function(itemA, itemB) {
			var result = 0;
			if  (itemA['persistentId'] == itemB['persistentId']) {
				result = 0;
			}
			else {
				var multicolumnCompareFunc = goog.partial(codeshelf.grid.propertyComparer, columns);
				result = multicolumnCompareFunc(itemA, itemB);
			}
			return result;
		};
	};
codeshelf.grid = {};

codeshelf.grid.propertyComparer = function(columns, itemA, itemB) {
	for(var i = 0; i < columns.length; i++) {
		var column = columns[i];
		var field = column['id'];

		var valueA = itemA[field];
        var valueB = itemB[field];

        var result = null;
        var customComparer = column['comparer'];
        if (typeof customComparer === 'function') {
            result = customComparer(valueA, valueB);
        } else {
            result = codeshelf.grid.valueComparer(valueA, valueB);
        }
		if (result != 0) {
			return result;
		} //else try the next one
	}
	return 0;
};

codeshelf.grid.valueComparer = function(valueA, valueB) {
	var result = 0;
	// remember that NaN === NaN returns false
	// and isNaN(undefined) returns true
	if (valueA == null && valueB == null) {
		result =  0;
	}
	else if (typeof valueA === "undefined" && typeof valueB === "undefined") {
		result = 0;
	}
	else if (isNaN(valueA) && isNaN(valueB)
			 && typeof valueA === 'number' && typeof valueB === 'number') {
		result = 0;
	}
	else if (typeof valueA === 'number' && typeof valueB === 'number') {
		if (valueA != valueB) {
			result = (valueA < valueB) ? -1 : 1;
		}
	}
	else if (typeof valueA === "string" && typeof valueB === "string"){
		result =  codeshelf.ASCIIAlphaNumericComparer(valueA, valueB);
		if (result != 0) {
		}
	}
	else if (typeof valueA === "boolean" && typeof valueB === "boolean"){
		if (valueA != valueB) {
			if (valueA == true) {
				result = -1;
			}
		}
	}
	else { //attempt string compare as default
		if (typeof valueA === "undefined" || valueA == null) {
			result = -1;
		}
		else if (typeof valueB === "undefined" || valueB == null){
			result = 1;
		}
		else {
			result = codeshelf.ASCIIAlphaNumericComparer(valueA.toString(), valueB.toString());
			if (result != 0) {
			}
		}
	}
	return result;
};
