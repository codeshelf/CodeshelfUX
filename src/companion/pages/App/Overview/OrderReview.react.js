import  React from "react";
import _ from "lodash";
import {getFacilityContext} from "data/csapi";
import {StatusSummary} from "data/types";
import {Table} from "components/common/Table";
import {Select, Input} from 'components/common/Form';
import {Row, Col} from 'components/common/pagelayout';

export default class OrderReview extends React.Component{

    constructor(props) {
        super(props);
        this.state= {
            status: "INPROGRESS",
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
                label: StatusSummary.toLabel("RELEASED"),
                value: "RELEASED"
            },
            {
                label: StatusSummary.toLabel("COMPLETE"),
                value: "COMPLETE"
            },
            {
                label: StatusSummary.toLabel("SHORT"),
                value: "SHORT"
            },
            {
                label: StatusSummary.toLabel("INPROGRESS"),
                value: "INPROGRESS"
            }
        ];

    }

    componentWillMount() {
        let {status} = this.state;
        this.findOrders({status: status});
    }

    handleFilterStatusBy(e) {
        this.setState({status: e.target.value}, () => {
            this.findOrders({
                "status" : this.state.status
            });
        });

    }

    handleFilterOrderIdBy(e) {
        this.setState({orderId: e.target.value}, () => {
            this.findOrders({
                "orderId": "*" + this.state.orderId + "*"
            });
        });

    }

    findOrders(filter) {
        getFacilityContext().findOrders(filter).then((orders) =>{
            this.setState({"orders": orders});
        });
    }

    render() {
        let orders = _.sortBy(this.state.orders, "domainId");
        let {status, orderId} = this.state;

        return (<div>
                <Row>
                    <Col md={4}>
                        <form>
                            <Select id="filterBy" label='Status Filter' value={status} options={this.orderStatusOptions} onChange={this.handleFilterStatusBy.bind(this)}/>
                            <Input label="Order ID" type="text" onChange={this.handleFilterOrderIdBy.bind(this)} value={orderId} />
                        </form>
                    </Col>
                </Row>
                <Table results={orders} columns={this.columns} columnMetadata={this.columnMetadata} sortedBy="+domainId"/>
                </div>);
    }
};
