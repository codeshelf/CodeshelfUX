var _ = require('lodash');

module.exports = {
    parseParameters: function(location) {
        return _.chain(location.search.substr(1).split("&"))
            .map(function(item){return item.split("=");})
            .reduce(function(params, parts){
                params[parts[0]] = decodeURIComponent(parts[1]);
                return params;
            }, {})
            .value();
    }

};
