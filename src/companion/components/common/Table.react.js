var React = require('react');
var _ = require('lodash');

require("tablesaw/dist/tablesaw.css");
require("imports?jQuery=jquery,this=>window!tablesaw/dist/tablesaw.js");
var $ = require("jquery");

var Row = React.createClass({
    render: function() {
        var {headers, data} = this.props;
        return (
                <tr>
                {
                    _.map(headers, function(header){
                        var key = header.key;
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
        var {headers} = this.props;
        var i = 0;
        return (
                <thead>
                    <tr>
                {
                    _.map(headers, function(header){
                        var key = header.key;
                        var title = header.title;
                        var priority = i++;
                        return (<th key={key} scope="col" data-tablesaw-priority={priority === 0 ? "persist" : priority} >{title}</th>);
                    })
                }
                    </tr>
                </thead>

        );
    }
});

var Table = React.createClass({
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
        var headers = [];
        if (rows && rows.length > 0) {
            headers = _.keys(rows[0]).map((key) => {
                var ret = {
                    key: key,
                    title: key
                };
                return ret;
            });
        }
        return (
                <table className="tablesaw" data-tablesaw-minimap data-tablesaw-mode="swipe">
                    <caption>{caption}</caption>
                    <Header headers={headers} />
                    <tbody>
                            {
                               rows.map(function(row, i) {
                                       return (<Row key={i} headers={headers} data={row} />);
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
};
