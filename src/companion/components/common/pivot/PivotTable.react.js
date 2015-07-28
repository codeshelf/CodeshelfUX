var React = require("react");
var orb = require("orb");
var uiheaders = require("orb/src/js/orb.ui.header");
require("./PivotTable.less");
import selectableCell from "./SelectablePivotCell";
import {extractDimensions} from "./celldimensions";

export default class PivotTable extends React.Component{

    constructor(props) {
        super(props);
        this.pivotWidget = null;
        this.state = {
            dimensions: []
        };
    }

    getConfig(props) {
        let options = props.options().toJS();
        return {
            width: "100%",
            height: "100%",
    	    dataSource: [{}],
    	    dataHeadersLocation: 'columns',
            theme: 'gray',
            toolbar: {
                visible: false
            },
    	    grandTotal: {
    		    rowsvisible: true,
    		    columnsvisible: true
    	    },
    	    subTotal: {
    		    visible: false,
                collapsed: true
    	    }
            , fields: options.fields
            , rows: options.rowFields
            , columns: options.columnFields
            , data: options.dataFields
        };
    }

    onDrillDown(dataCell, pivotId) {
        if (dataCell) {
            var dimensions = extractDimensions(dataCell);
            this.setState({dimensions: dimensions});

            var indexes = [];
            if(dataCell.colType === uiheaders.HeaderType.GRAND_TOTAL) {
                indexes = dataCell.rowDimension.getRowIndexes();
            } else if (dataCell.rowType === uiheaders.HeaderType.GRAND_TOTAL) {
                indexes = dataCell.columnDimension.getRowIndexes();
            } else {
                var colIndexes = dataCell.columnDimension.getRowIndexes();
                indexes = dataCell.rowDimension.getRowIndexes().filter((index) => {
                    return colIndexes.indexOf(index) >= 0;
                });
            }

            var data = indexes.map((index) => {
                return this.pivotWidget.pgrid.filteredDataSource[index];
            });
            this.props.onDrillDown(data);
        }
    }

    /**
     * Track the moves of fields in the pivot table and store
     */
    onFieldMoved(field, oldAxeType, newAxeType, position) {
        //console.log("Field moved", arguments);
        let axes = [0, "columnFields", "rowFields", "dataFields"];

        this.props.options((options) => {
            var newOptions = options;
            if (oldAxeType != null) {
                var removeAxe = axes[oldAxeType];
                var removeFunc = (fields) => {
                    return fields.delete(fields.indexOf(field));
                };
                newOptions = options.updateIn([removeAxe], removeFunc);
            }

            if (newAxeType != null) {
                var addAxe = axes[newAxeType];
                var addFunc = (fields) => {
                    if (position != null) {
                        return fields.splice(position, 0, field);
                    } else {
                        return fields.push(field);
                    }
                };
                return newOptions.updateIn([addAxe], addFunc);
            } else {
                return newOptions;
            }
        });
    }

    componentDidMount() {
        var el = React.findDOMNode(this);
        let orders = this.props.results;
        let config = this.getConfig(this.props);
        config.dataSource = orders.toJS();
        this.pivotWidget = new orb.pgridwidget(config);
        window.OrbReactClasses.PivotCell = selectableCell(window.OrbReactClasses.PivotCell, () => {
            return this.state.dimensions;
        }.bind(this));

        console.log("Orb ReactClasses overriden");

        this.pivotWidget.drilldown = this.onDrillDown.bind(this);

        // Wrap original call to move field so that local method can be called
        let original = this.pivotWidget.moveField;
        this.pivotWidget.moveField = function() {
            var origArgs = Array.prototype.slice.call(arguments); //toArray
            var result = original.apply(this.pivotWidget, origArgs);
            this.onFieldMoved.apply(this, origArgs);
            return result;
        }.bind(this);

        this.pivotWidget.render(el);


    }

    componentWillReceiveProps(nextProps) {
        if (this.props.results != nextProps.results) {
            this.pivotWidget.refreshData(nextProps.results.toJS());
        }
    }


    componentWillUnmount() {
        var result = React.unmountComponentAtNode(React.findDOMNode(this));
        console.log(result);
    }

    render() {
        return (<div></div>);
    }
};
