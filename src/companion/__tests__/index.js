// Browser ES6 Polyfill
require('babel/polyfill');

var testsContext = require.context('../../companion', true, /spec.js$/);
testsContext.keys().forEach(testsContext);
