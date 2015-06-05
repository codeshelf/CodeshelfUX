import  React from "react";
import _ from "lodash";
import {getFacilityContext} from "data/csapi";
import {Table} from "components/common/Table";
import {Select} from 'components/common/Form';
import {Row, Col} from 'components/common/pagelayout';

export default class OrderList extends React.Component{

    constructor(props) {
        super(props);
        this.state= {
            status: this.props.status,
            orders: []
        };

        this.columnMetadata = [
            {
                columnName: "domainId",
                displayName: "Order ID"
            },
            {
                columnName: "containerId",
                displayName: "Container"
            },
            {
                columnName: "status",
                displayName: "Status"
            }
        ];
        this.columns = _.pluck(this.columnMetadata, "columnName");

        this.orderStatusOptions = [
            {
                label: "Released",
                value: "RELEASED"
            },
            {
                label: "Complete",
                value: "COMPLETE"
            },
            {
                label: "Short",
                value: "SHORT"
            },
            {
                label: "In progress",
                value: "INPROGRESS"
            }
        ];

    }

    componentWillMount() {
        let {status} = this.state;
        this.findOrders(status);
    }

    handleFilterStatusBy(e) {
        this.setState({status: e.target.value}, () => {
            this.findOrders(this.state.status);
        });

    }

    findOrders(status) {
        getFacilityContext().getOrdersForStatus(status).then((orders) =>{
            this.setState({"orders": orders});
        });
    }

    render() {
        let orders = _.sortBy(this.state.orders, "domainId");
        let {status} = this.state;

        return (<div>
                <Row>
                    <Col md={4}>
                        <Select id="filterBy" label='Status Filter' value={status} options={this.orderStatusOptions} onChange={this.handleFilterStatusBy.bind(this)}/>
                    </Col>
                </Row>
                <Table results={orders} columns={this.columns} columnMetadata={this.columnMetadata} sortedBy="+domainId"/>
                </div>);
    }
};
