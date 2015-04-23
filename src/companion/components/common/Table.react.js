var React = require('react');
var _ = require('lodash');
var Immutable = require('immutable');
//require("tablesaw/dist/tablesaw.css");
//require("imports?jQuery=jquery,this=>window!tablesaw/dist/tablesaw.js");
var $ = require("jquery");
import classnames from 'classnames';

var Row = React.createClass({
    render: function() {
        var {columnMetadata,
             row,
             rowNumber,
             expanded,
             onClick } = this.props;
        var rowAlt = (rowNumber % 2 == 0) ? "even" : "odd";
        var shown = (expanded) ? "shown" : "";
        return (
                <tr role="row" onClick={_.partial(onClick, row, rowNumber)} className={classnames(rowAlt, shown)}>
                {
                    columnMetadata.map(function(columnMetadata){
                        var key = columnMetadata.get("columnName");
                        var value = row.get(key);
                        var CustomComponent = columnMetadata.get("customComponent");
                        var valueRenderer = (<span>{value}</span>);
                        if (CustomComponent) {
                            valueRenderer = ( <CustomComponent rowData={row} />);
                        }
                        return (<td key={key}>{valueRenderer}</td>);
                    })
                }
                </tr>

        );
    }
});

class ExpandRow extends React.Component {
    render() {
        let {columns} = this.props;
        let colspan = columns.size;
        return <tr className="row-details"><td colSpan={colspan}>{this.props.children}</td></tr>;
    }

}

class Header extends React.Component {

    getMetadata(columnMetadata, columnName) {
        let metadata = columnMetadata.find((obj) => obj.get("columnName") === columnName);
        if (metadata == null) {
            console.warn(`no column metadata for column: ${columnName}`);
        }
        return metadata;
    }

    render() {
        var {columns, columnMetadata} = this.props;
        return (
                <thead>
                <tr>
                {
                    columns.map(function(column, index){
                        let {columnName, displayName} = this.getMetadata(columnMetadata, column).toObject();
                        var priority = index;
                        return (<th key={columnName} scope="col" data-tablesaw-priority={priority === 0 ? "persist" : priority} >{displayName}</th>);
                    }.bind(this))
                }
                </tr>
                </thead>);
    }
}

var Table = React.createClass({
    propTypes: {
        results: React.PropTypes.object.isRequired,
        expand: React.PropTypes.object,
        ExpandComponent: React.PropTypes.element
    },

    getDefaultProps: function(){
        return {
            "caption": "",
            "rows": []
        };
    },
    render: function() {
        const expandNotSet = Immutable.Map();
        var {caption = "",
             results = Immutable.List(),
             columns = Immutable.List(),
             columnMetadata = Immutable.List(),
             onRowExpand = function (){},
             onRowCollapse = function (){},
             expand = expandNotSet,
             ExpandComponent} = this.props;
        var rows = results;
        if (rows.constructor === Array) {
            rows = Immutable.fromJS(rows);
        }
        if (columns.constructor === Array) {
            columns = Immutable.fromJS(columns);
        }
        if (columnMetadata.constructor === Array) {
            columnMetadata = Immutable.fromJS(columnMetadata);
        }
        if (rows.size > 0) {
            var first = rows.first();
            if (columns.isEmpty()) {
               columns = first.keySeq();
            }

            if (columnMetadata.isEmpty()) {
                columnMetadata = first.keySeq().map((key) => {
                    return Immutable.Map({
                        columnName: key,
                        displayName: key
                    });
                });
            }
        }
        var classes = classnames({
            "table": true,
            "table-hover": true,
            "table-striped" : true,
            "dataTable": true,
            "no-footer":true,

            "table-detailed" : expand !== expandNotSet,
            "table-condensed": expand !== expandNotSet
        });
        return (
                <table className={classes} role="grid">
                    <caption>{caption}</caption>
                    <Header columns={columns} columnMetadata={columnMetadata}/>
                    <tbody>
                            {
                               rows.map(function(row, i) {
                                   var rowNumber = i;
                                   var childProps = {
                                       columnMetadata: columnMetadata,
                                       columns: columns,
                                       row: row,
                                       rowNumber: rowNumber
                                   };

                                   if (Immutable.is(row, expand)) {
                                       return Immutable.List.of(
                                           <Row key={rowNumber} {...childProps} onClick={onRowCollapse} expanded={true}/>,
                                           <ExpandRow key={rowNumber+"-expand"} {...childProps}>
                                               <ExpandComponent {...childProps} />
                                           </ExpandRow>);
                                   } else {
                                       return (<Row key={rowNumber} onClick={onRowExpand} {...childProps} expanded={false}/>);
                                   }
                               }).flatten(true).toJS()
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
