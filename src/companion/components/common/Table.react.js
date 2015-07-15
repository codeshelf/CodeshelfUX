var React = require('react');
var _ = require('lodash');
var Immutable = require('immutable');
//require("tablesaw/dist/tablesaw.css");
//require("imports?jQuery=jquery,this=>window!tablesaw/dist/tablesaw.js");
var $ = require("jquery");
import classnames from 'classnames';
import Icon from "react-fa";
import { DragSource, DropTarget, DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd/modules/backends/HTML5';



//TODO likely need better performing index of metadata
function toShownColumns(columnMetadata, columns) {
    return columnMetadata
        .filter((metadata) => {
            return columns.includes(metadata.get("columnName"));
        })
        .sortBy((metadata) => {
            return columns.indexOf(metadata.get("columnName")) || 0;
        });
}

var Row = React.createClass({
    render: function() {
        var {columns,
             columnMetadata,
             row,
             rowNumber,
             expanded,
             onClick } = this.props;
        var rowAlt = (rowNumber % 2 == 0) ? "even" : "odd";
        var shown = (expanded) ? "shown" : "";
        return (
                <tr role="row" onClick={_.partial(onClick, row, rowNumber)} className={classnames(rowAlt, shown)}>
                {
                    toShownColumns(columnMetadata, columns).map((metadata) => {
                        let key = metadata.get("columnName");
                        var value = row.get(key);

                        value = (typeof value === "boolean") ? value.toString() : value;
                        var CustomComponent = metadata.get("customComponent");
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

class ColumnHeader extends React.Component {

    render() {
        let {columnName, displayName = columnName, sortSpec} = this.props;
        const { isDragging, connectDragSource, connectDropTarget } = this.props;
            return (connectDragSource(connectDropTarget(
                    <th key={columnName}
                        scope="col"
                        data-toggle="tooltip"
                        title={displayName}>
                            {displayName}
                            {(sortSpec) ?
                                <Icon name={"sort-numeric-"+sortSpec.direction} />
                                :
                            null
                            }
                     </th>)));
    }
}


/**
 * Implements the drag source contract.
 */
const cardSource = {
    beginDrag(props) {
        return {
            columnName: props.columnName
        };
    }
};

const cardTarget = {
    hover(props, monitor) {
        const draggedId = monitor.getItem().columnName;
        if (draggedId !== props.columnName) {
            props.onMove(draggedId, props.columnName);
        }
    }
};

/**
 * Specifies the props to inject into your component.
 */
function collectDrag(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}

function collectDrop(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget()
    };
}

var DraggableColumnHeader = DragSource("table-header", cardSource, collectDrag)(ColumnHeader);
var DragDropColumnHeader = DropTarget("table-header", cardTarget, collectDrop)(DraggableColumnHeader);

class Header extends React.Component {

    toSortSpec(sortedBy, columnName) {
        let sortSpec = (sortedBy && sortedBy.find((s) => s.property === columnName));
        return sortSpec;
    }

    render() {
            var {columns, columnMetadata, sortedBy, onColumnMove} = this.props;

        return (
                <thead>
                <tr>
                {
                    toShownColumns(columnMetadata, columns).map(function (metadata, index)  {
                            let {columnName, displayName = columnName} = metadata.toObject();
                            var sortSpec = this.toSortSpec(sortedBy, columnName);
                            return (<DragDropColumnHeader
                                        columnName={columnName}
                                        displayName={displayName}
                                        sortSpec={sortSpec}
                                        onMove={onColumnMove}/>);
                            }.bind(this))
                }
                </tr>
                </thead>);
    }
}

var DraggableHeader = DragDropContext(HTML5Backend)(Header);

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
             onColumnMove = () => { console.log("column moveHandler not set");},
             expand} = this.props;
        if (columns.constructor === Array) {
            columns = Immutable.fromJS(columns);
        }
        if (columnMetadata.constructor === Array) {
            columnMetadata = Immutable.fromJS(columnMetadata);
        }

        if (columns.count() == 0 && columnMetadata.count() > 0) {
            columns = columnMetadata.map((column) => {
                return column.get("columnName");
            });
        }


        if (rows.count() > 0) {
            var first = rows.first() ;
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
                            <DraggableHeader
                                columns={columns}
                                columnMetadata={columnMetadata}
                                sortedBy={sortedBy}
                                onColumnMove={onColumnMove}/>
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
        var {results = [], emptyMessage = "No Data Available"} = this.props;
        if (results.constructor === Array) {
            results = Immutable.fromJS(results);
        }

        return (results.count() > 0) ?
            this.renderTable(results)
            :
            <h3>{emptyMessage}</h3>;
    }
});


module.exports = {
    "Table": Table,
    "Header": Header,
    "Row": Row
};
