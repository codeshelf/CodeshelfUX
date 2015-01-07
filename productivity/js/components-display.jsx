var React = require('react');
var _ = require('lodash');

var Navbar = require('components/nav').Navbar;

var facilityNames = ['', 'F1', 'San Leandro', 'REALLY REALLY LONG FOR THE DESIGN'];
_.forEach(facilityNames, function(facilityName){
    var navHeaderNode = document.createElement('div');
    document.body.appendChild(navHeaderNode);
    React.render(<Navbar title={facilityName} navMenus={[]}/>, navHeaderNode);
});
