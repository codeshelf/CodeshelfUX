var React = require("react");
var orb = require("orb");
require("./PivotTable.less");
import selectableCell from "./SelectablePivotCell";
import {extractDimensions} from "./celldimensions"

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
                caption: 'Status'
            },
            {
                name: 'customerId',
                caption: 'Customer',
                formatFunc: (data) => {
                    if (data == null) {
                        return "<N/A>";
                    } else {
                        return data;
                    }
                }
            },
            {
                name: "shipperId",
                caption: "Shipper"
            },
            {
                name: "",
                caption: "Count",
                dataSettings: {aggregateFunc: 'count'}

            }

        ],
        rows    : [ 'Status' ],
        columns : [ 'Customer' ],
        data: ["Count"]
    };
    }

    onDrillDown(dataCell, pivotId) {
        if (dataCell) {
            var dimensions = extractDimensions(dataCell);
            this.setState({dimensions: dimensions});
            
            var colIndexes = dataCell.columnDimension.getRowIndexes();
            var data = dataCell.rowDimension.getRowIndexes().filter((index) => {
                return colIndexes.indexOf(index) >= 0;
            }).map((index) => {
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
