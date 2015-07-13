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

    getConfig() {
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
    	},
        fields: [
            {
                name: 'status',
                caption: 'Status',
                sort: {order: "asc"}
            },
            {
                name: 'customerId',
                caption: 'Customer',
                sort: { order: "asc"}
                },
            {
                name: 'destinationId',
                caption: 'Destination',
                sort: { order: "asc"}
                },
            {
                name: "shipperId",
                    caption: "Shipper",
                sort: { order: "asc"}
            },
            {
                name: "dueDay",
                caption: "Date Due",
                sort: { order: "asc"}
            },
            {
                name: "dueTime",
                caption: "Time Due",
                sort: { order: "asc"}
            },
            {
                name: "count",
                caption: "Count",
                dataSettings: {aggregateFunc: 'count'}

            }

        ],
            rows    : [ 'dueDay', "customerId" ],
        columns : [ 'status' ],
        data: ["count"]
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

    componentDidMount() {
        var el = React.findDOMNode(this);
        let orders = this.props.orders;
        let config = this.getConfig();
        config.dataSource = orders.toJS();
        this.pivotWidget = new orb.pgridwidget(config);
        window.OrbReactClasses.PivotCell = selectableCell(window.OrbReactClasses.PivotCell, () => {
            return this.state.dimensions;
        }.bind(this));
        console.log("ReactClasses", window.OrbReactClasses);


        this.pivotWidget.drilldown = this.onDrillDown.bind(this);

        this.pivotWidget.render(el);


    }

    componentWillReceiveProps(nextProps) {
        this.pivotWidget.refreshData(nextProps.orders.toJS());
    }


    componentWillUnmount() {
        var result = React.unmountComponentAtNode(React.findDOMNode(this));
        console.log(result);
    }

    render() {
        return (<div></div>);
    }
};
