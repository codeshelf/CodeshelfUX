var React = require('react');
var _ = require('lodash');
//relies on jquery and tablesaw but just make sure it is included globally

//var $ = require('jquery');
//var tablesaw = require('tablesaw/dist/tablesaw');

var Row = React.createClass({
    render: function() {
        var {data} = this.props;
        var cells = data.split(",");
        var i = 0;
        return (
                            <tr>
                                {

                                    cells.map(function(value) {
                                        var key=i++;
                                        return (<td key={key}>{value}</td>);
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
                        var key = i++;
                        return (<th key={key} scope="col" data-tablesaw-sortable-col data-tablesaw-priority={key == 0 ? "persist" : 0} >{value}</th>);
                    })

                }
            </tr>
            </thead>

        );
    }
});

var Table =  React.createClass({
    componentDidMount: function() {
        var node = this.getDOMNode();
        var jqNode = $(node);
        jqNode.table();
    },
    render: function() {
        var {caption , rows} = this.props;
        return (
                                <table className="tablesaw tablesaw-stack" data-tablesaw-mode="stack">
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
