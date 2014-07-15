goog.provide('codeshelf.authz');
goog.require('goog.array');

/**
 * @constructor
 */
codeshelf.Authz = function() {
	this.permissions = []
};

/**
 * @param {!Array} permissionStringArray
 */
codeshelf.Authz.prototype.setPermissions = function(permissionStringArray) {
	this.permissions = goog.array.map(permissionStringArray, function(permissionString) {
		return new codeshelf.WildcardPermission(permissionString);
	});
};

codeshelf.Authz.prototype.hasPermission = function(permissionString) {
	var permissionToCheck = new codeshelf.WildcardPermission(permissionString);
	return goog.array.some(this.permissions, function(permission) {
		return permission.implies(permissionToCheck);
	});
};

codeshelf.WildcardPermission = function(permissionString) {
	this.parts = this.toParts(permissionString);

	this.asString = function() {
		return permissionString;
	};

	this.asParts = function() {
		return this.parts;
	};

	this.implies = function(other) {
		var i;
		for (i = 0; i < other.asParts().length; ++i) {
			if (this.parts.length - 1 < i) {
				return true;
			} else {

				if (this.parts[i].indexOf('*') === -1 && !this.containsAll(this.parts[i], other.asParts()[i])) {
					return false;
				}
			}
		}

		for (; i < this.parts.length; ++i) {
			if (this.parts[i].indexOf('*') === -1) {
				return false;
			}
		}
		return true;
	};
};

/**
 * @private
 */
codeshelf.WildcardPermission.prototype.toParts = function(permissionString) {
		var parts = [];
		var levels = permissionString.split(':');

		for (var i = 0; i < levels.length; ++i) {
			parts.push(levels[i].split(','));
		}
		return parts;
};

/**
 * @private
 */
codeshelf.WildcardPermission.prototype.containsAll = function(source, vals) {
		for (var i = 0; i < vals.length; ++i) {
			if (source.indexOf(vals[i]) === -1) {
				return false;
			}
		}
		return true;
};
