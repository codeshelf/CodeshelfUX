var React = require('react');
var _ = require('lodash');

var Table = require('components/table').Table;

var data = [{
    "orderId" : "123345",
    "orderDetailId" : "adasdfasfdasfasfasfasfdssfafaa",
    "planQuantity": 2
}
        ];
React.render(<Table rows={data}/>, document.body);

