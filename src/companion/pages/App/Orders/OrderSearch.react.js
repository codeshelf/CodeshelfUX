import {getFacilityContext} from "data/csapi";
import {Row, Col} from 'components/common/pagelayout';
import {Select, Input} from 'components/common/Form';

export default class OrderSearch extends React.Component {

    refresh() {
        return this.doSearch();
    }

    handleSubmit(e) {
        e.preventDefault();
        this.doSearch();
    }

    doSearch() {
        let value = React.findDOMNode(this.refs.orderId).getElementsByTagName("input")[0].value;
        let  filter = {
            "orderId": "*" + value + "*"
        };
        return getFacilityContext().findOrders(filter).then((orders) =>{
            this.onOrdersUpdated(orders);
        });
    }

    onOrdersUpdated(orders) {
        this.props.onOrdersUpdated(orders);
    }

    render() {
        return (
            <Row>
                <Col md={4}>
                    <form onSubmit={this.handleSubmit.bind(this)}>
                        <Input ref="orderId" label="Order ID" name="orderId" type="text" />
                    </form>
                </Col>
            </Row>);
    }
}
