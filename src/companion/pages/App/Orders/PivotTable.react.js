var React = require("react");
var orb = require("orb");
//var {PivotTable} = require('orb/src/js/react/orb.react.compiled');

require("./PivotTable.less");
export default class PivotTable extends React.Component{

    constructor(props) {
        super(props);
        this.pivotWidget = null;
    }

    getConfig() {
    var data = [
        {"dueDate":null,"active":true,"orderType":"OUTBOUND","destinationId":null,"persistentId":"d30dfabb-3e33-4217-9434-88ffaab70890","status":"RELEASED","pickStrategy":"SERIAL","customerId":"WORLD","updated":1434752011887,"orderDate":null,"containerId":"526768720","shipperId":"FEDEX","domainId":"526768720"},
        {"dueDate":null,"active":true,"orderType":"OUTBOUND","destinationId":null,"persistentId":"d30dfabb-3e33-4217-9434-88ffaab70890","status":"RELEASED","pickStrategy":"SERIAL","customerId":"LUNERA","updated":1434752011887,"orderDate":null,"containerId":"526768720","shipperId":"FEDEX","domainId":"526768720"},
        {"dueDate":null,"active":true,"orderType":"OUTBOUND","destinationId":null,"persistentId":"d30dfabb-3e33-4217-9434-88ffaab70890","status":"RELEASED","pickStrategy":"SERIAL","customerId":"WORLD","updated":1434752011887,"orderDate":null,"containerId":"526768720","shipperId":"UPS","domainId":"526768720"},
        {"dueDate":null,"active":true,"orderType":"OUTBOUND","destinationId":null,"persistentId":"d30dfabb-3e33-4217-9434-88ffaab70890","status":"RELEASED","pickStrategy":"SERIAL","customerId":"LUNERA","updated":1434752011887,"orderDate":null,"containerId":"526768720","shipperId":"UPS","domainId":"526768720"}

    ];
    return {
        width: "100%",
        height: "100%",
    	dataSource: data,
    	dataHeadersLocation: 'columns',
        theme: 'gray',
        toolbar: {
            visible: true
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

    componentDidMount() {
        var el = React.findDOMNode(this);
        var orb = require("orb");
        this.pivotWidget = new orb.pgridwidget(this.getConfig());
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
