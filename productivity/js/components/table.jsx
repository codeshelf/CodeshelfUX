var React = require('react');
var _ = require('lodash');
//relies on jquery and tablesaw but just make sure it is included globally

//var $ = require('jquery');
//var tablesaw = require('tablesaw/dist/tablesaw');

var HeaderTitle = {
    "orderId" : "Order Id",
    "orderDetailId" : "Detail Id",
    "planQuantity" : "Qty."
};

var Row = React.createClass({
    render: function() {
        var {headers, data} = this.props;
        return (
                <tr>
                {
                    _.keys(headers).map(function(key){
                        var value = data[key];
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
        var i = 0;
        return (
                <thead>
                    <tr>
                {
                    _.keys(data).map(function(key){
                        var title = data[key];
                        var priority = i++;
                        return (<th key={key} scope="col" data-tablesaw-sortable-col data-tablesaw-priority={priority == 0 ? "persist" : priority} >{title}</th>);
                    })
                }
                    </tr>
                </thead>

        );
    }
});

var Table =  React.createClass({
    getDefaultProps: function(){
        return {
            "caption": "",
            "rows": []
        };
    },
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
                    <Header data={HeaderTitle} />
                    <tbody>
                            {
                               rows.map(function(row) {
                                       return (<Row headers={HeaderTitle} data={row} />);
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
