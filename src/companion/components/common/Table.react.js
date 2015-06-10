var React = require('react');
var _ = require('lodash');
var Immutable = require('immutable');
//require("tablesaw/dist/tablesaw.css");
//require("imports?jQuery=jquery,this=>window!tablesaw/dist/tablesaw.js");
var $ = require("jquery");
import classnames from 'classnames';
import Icon from "react-fa";

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
                            valueRenderer = ( <CustomComponent rowData={row} cellData={value} />);
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

    toSortSpec(sortBy) {
        let firstChar = (sortBy && sortBy.length > 0) ? sortBy.charAt(0) : null;
        if (firstChar) {
            return {
                dir: (firstChar === '-') ? "desc" : "asc",
                columnName: sortBy.substring(1)
            };
        } else {
            return null;
        }
    }

    render() {
        var {columns, columnMetadata, sortedBy} = this.props;
        let sortSpec = this.toSortSpec(sortedBy);
        return (
                <thead>
                <tr>
                {
                    columns.map(function(column, index){
                        let {columnName, displayName = columnName} = this.getMetadata(columnMetadata, column).toObject();
                        var priority = index;

                        return (<th key={columnName} scope="col" data-tablesaw-priority={priority === 0 ? "persist" : priority} >
                                   {displayName}
                                   {(sortSpec && sortSpec.columnName === columnName) ?
                                       <Icon name={"sort-numeric-"+sortSpec.dir} />
                                        :
                                        null
                                   }
                                </th>);
                    }.bind(this))
                }
                </tr>
                </thead>);
    }
}

var Table = React.createClass({
    propTypes: {
        results: React.PropTypes.object.isRequired,
        expand: React.PropTypes.func
    },

    getDefaultProps: function(){
        return {
            "caption": "",
            "rows": []
        };
    },

    renderTable: function(rows) {
        var {caption = "",
             columns = Immutable.List(),
             columnMetadata = Immutable.List(),
             sortedBy,
             onRowExpand = function (){ console.log("row expand not set");},
             onRowCollapse = function (){ console.log("row collapse not set");},
             expand} = this.props;
        if (columns.constructor === Array) {
            columns = Immutable.fromJS(columns);
        }
        if (columnMetadata.constructor === Array) {
            columnMetadata = Immutable.fromJS(columnMetadata);
        }
        if (rows.size > 0) {
            var first = rows.first()
;
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

            "table-detailed" : expand != null,
            "table-condensed": expand != null
        });

        if (expand == null) {
            expand = () => {return null;};
        }
        return (
                <table className={classes} role="grid">
                    <caption>{caption}</caption>
                    <Header columns={columns} columnMetadata={columnMetadata} sortedBy={sortedBy}/>
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

                                   let renderExpandComponent = expand(row, rowNumber);
                                   if (renderExpandComponent != null) {
                                       return Immutable.List.of(
                                           <Row key={rowNumber} {...childProps} onClick={onRowCollapse} expanded={true}/>,
                                           <ExpandRow key={rowNumber+"-expand"} {...childProps}>
                                               {renderExpandComponent}
                                           </ExpandRow>);
                                   } else {
                                       return (<Row key={rowNumber} onClick={onRowExpand} {...childProps} expanded={false}/>);
                                   }
                               }).flatten(true).toJS()
                            }
                    </tbody>
                </table>
        );
    },
    render: function() {
        var {results = []} = this.props;
        if (results.constructor === Array) {
            results = Immutable.fromJS(results);
        }

        return (results.count() > 0) ?
            this.renderTable(results)
            :
            <h3>No Data Available</h3>;
    }
});


module.exports = {
    "Table": Table,
    "Header": Header,
    "Row": Row
};
