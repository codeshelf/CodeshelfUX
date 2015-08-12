import React from "react/addons";
var _ = require('lodash');
var Immutable = require('immutable');
//require("tablesaw/dist/tablesaw.css");
//require("imports?jQuery=jquery,this=>window!tablesaw/dist/tablesaw.js");
var $ = require("jquery");
import classnames from 'classnames';
import Icon from "react-fa";
import { DragSource, DropTarget} from 'react-dnd';
import PureComponent from 'components/common/PureComponent';

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

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

class Row extends PureComponent {
    getWidth(columnName) {
        var tdNode = React.findDOMNode(this.refs[columnName]);
        var scrollWidth = tdNode.scrollWidth;
        return scrollWidth + 1;
    }

    render() {
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
                        return (<td ref={key} key={key}>{valueRenderer}</td>);
                    }).toList()
                }
                </tr>
        );
    }
}

class ExpandRow extends React.Component {
    render() {
        let {columns} = this.props;
        let colspan = columns.size;
        return <tr className="row-details"><td colSpan={colspan}>{this.props.children}</td></tr>;
    }

}

class ColumnHeader extends React.Component {

    render() {
            let {columnName, displayName = columnName, width, sortSpec, onClick} = this.props;
            let { isDragging, connectDragSource = (c) => c, connectDropTarget = (c) => c} = this.props;

            var classes = classnames({"dragging": isDragging});
            var style = {};
            if (width) {
                style.width = width;
            }
            return (connectDragSource(connectDropTarget(
                    <th key={columnName}
                        className={classes}
                        style={style}
                        scope="col"
                        data-toggle="tooltip"
                        onClick={onClick}
                        title={displayName}>
                            {(sortSpec) ?
                             <Icon name={"sort-numeric-"+sortSpec.direction} style={{marginRight: "0.25em"}}/>
                             :
                             null
                            }
                            {displayName}
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
        var {columns, columnMetadata, columnWidths, sortedBy, onColumnMove, onColumnClick} = this.props;

        return (
                <thead>
                    <tr>
                {
                    toShownColumns(columnMetadata, columns).map(function (metadata, index)  {
                            let {columnName, displayName = columnName} = metadata.toObject();
                            var sortSpec = this.toSortSpec(sortedBy, columnName);
                            var width = columnWidths[columnName];
                            return (<DragDropColumnHeader
                                 key={columnName}
                                 columnName={columnName}
                                 width={width}
                                 displayName={displayName}
                                 sortSpec={sortSpec}
                                 onMove={onColumnMove}
                                 onClick={(e) => {onColumnClick(sortSpec, columnName, e);}}/>);

                        }.bind(this))
                        .toList()
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

    getInitialState: function() {
        return {
            widths: {}
        };
    },

    handleColumnClick: function(oldSortSpec, columnName, evt) {
        if (!evt.ctrlKey) {
            var direction = "desc";
            if (oldSortSpec && oldSortSpec.get("direction") === "desc") {
                direction = "asc";
            }
            let {onColumnSortChange} = this.props;
            if (onColumnSortChange) {
                onColumnSortChange(columnName, direction);
            }
        } else {
            var widths = this.state.widths;
                if (widths[columnName]) {
                delete widths[columnName];
            } else {
                var largestCellWidth = 0;
                for(var key in this.refs) {
                    if (key.indexOf("row") == 0) {
                        largestCellWidth = Math.max(largestCellWidth, this.refs[key].getWidth(columnName));
                    }
                }
                widths[columnName] = largestCellWidth;
            }
            this.setState({widths: widths});

        }
    },

    renderTable: function(rows) {
        var {caption = "",
             columns = Immutable.List(),
             columnMetadata = Immutable.List(),
             keyColumn,
             sortedBy,
             onRowExpand = function (){ console.log("row expand not set");},
             onRowCollapse = function (){ console.log("row collapse not set");},
             onColumnMove = () => { console.log("column moveHandler not set");},
             onColumnSortChange = () => { console.log("onColumnSortChange  not set");},
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
                            <Header
                                columns={columns}
                                columnMetadata={columnMetadata}
                                columnWidths={this.state.widths}
                                sortedBy={sortedBy}
                                onColumnMove={onColumnMove}
                                onColumnClick={this.handleColumnClick}/>
                <ReactCSSTransitionGroup transitionName="newrow" component="tbody">
                            {
                               rows.map(function(row, i) {
                                   var rowNumber = i;
                                   var childProps = {
                                       columnMetadata: columnMetadata,
                                       columns: columns,
                                       row: row,
                                       rowNumber: rowNumber
                                   };
                                   var id = rowNumber;
                                   if (keyColumn) {
                                       id = row.get(keyColumn);
                                   }
                                   let renderExpandComponent = expand(row, rowNumber);
                                   if (renderExpandComponent != null) {
                                       return Immutable.List.of(
                                               <Row ref={"row" + rowNumber} key={id} {...childProps} onClick={onRowCollapse} expanded={true}/>,
                                           <ExpandRow key={id+"-expand"} {...childProps}>
                                               {renderExpandComponent}
                                           </ExpandRow>);
                                   } else {
                                       return (<Row ref={"row" + rowNumber} key={id} onClick={onRowExpand} {...childProps} expanded={false}/>);
                                   }
                               }).flatten(true).toJS()
                               }
                </ReactCSSTransitionGroup>
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
