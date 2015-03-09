var React = require('react');
var _ = require('lodash');
var $ = require('jquery');
var Row = React.createClass({
    render: function() {
        var {data} = this.props;
        var cells = data.split(",");
        var i = 0;
        return (
                            <tr>
                                {

                                    cells.map(function(value) {
                                        return (<td key={i++}>{value}</td>);
                                    })

                                }
                            </tr>

        );
    }
});

var Header = React.createClass({
    render: function() {
        var {data} = this.props;
        var cells = data.split(",");
        var i = 0;
        return (
                <thead>
                    <tr>
                {

                    cells.map(function(value) {
                        return (<th key={i++}>{value}</th>);
                    })

                }
            </tr>
            </thead>

        );
    }
});

var Table =  React.createClass({
    render: function() {
        var {caption , rows} = this.props;
        return (
                                <table className="table table-striped">
                <caption>{caption}</caption>
                            <Header data="Order Id, Order Detail Id, Quantity, Order Date, Due Date, Shipper, Customer" />
                            <tbody>
                            {
                               rows.map(function(row) {
                                       return (<Row data={row} />);
                               })
                            }
                             </tbody>
                        </table>
        );
    }
});


module.exports = {
    "Table": Table,
    "Header": Header,
    "Row": Row
}
