import {getFacilityContext} from "data/csapi";
import {Row, Col} from 'components/common/pagelayout';
import {Select, Input, WrapInput} from 'components/common/Form';
import Promise from "bluebird";
import _ from "lodash";
import DayOfWeekFilter from 'components/common/DayOfWeekFilter';

export default class OrderSearch extends React.Component {

    constructor(props){
        super(props);
        this.state = {};
    }

    refresh() {
        return this.doSearch();
    }

    handleSubmit(e) {
        e.preventDefault();
        this.doSearch();
    }

    handleDayChange(daysBack) {
        this.doSearch();
    }

    doSearch() {
        let {searchPending} = this.state;
        if (searchPending != null && searchPending.isPending()) {
            searchPending.cancel();
        }

        let interval = this.refs.dueDateFilter.getInterval();
        let orderIdSubstring = React.findDOMNode(this.refs.orderId).getElementsByTagName("input")[0].value;
        let  filter = {
            orderId: orderIdSubstring,
            properties: ["orderId"]
        };
        if (interval) {
            filter['dueDate'] = interval.toQueryParameterValue();
        }

        var error = null;
        console.log("searching orders with filter: ", filter);
        var totalOrders = [];
        let promise = getFacilityContext().findOrderReferences(filter)
            .then((orderRefs) =>{

                return Promise.map(_.chunk(orderRefs, 100), (orderRefSet) =>{
                    if (error) {
                        return error;
                    }
                    return Promise
                        .map(orderRefSet, (orderRef) =>{
                            if (error) {
                                return error;
                            }
                            return Promise.resolve(getFacilityContext().getOrder(orderRef, this.props.properties.toJS()));
                        }, {concurrency: 2})
                        .then((orders) => {
                            totalOrders = totalOrders.concat(orders);
                            this.onOrdersUpdated(totalOrders);

                        });
                 }, {concurrency: 1});
             })
             .then(() => {
                 this.onOrdersUpdated(totalOrders);
             })
             .catch(Promise.CancellationError, (e) => {
                 console.log("cancelling order search with filter", filter, e);
                 error = e;
            });

        this.setState({searchPending:  promise});
        return promise;
    }

    onOrdersUpdated(orders) {
        this.props.onOrdersUpdated(orders);
    }

    render() {
        return (
            <Row>
                <Col md={6}>
                    <form onSubmit={this.handleSubmit.bind(this)}>
                        <WrapInput label="Due Date">
                                <DayOfWeekFilter ref="dueDateFilter" numDays={4} onChange={this.handleDayChange.bind(this)}/>
                        </WrapInput>
                        <Input ref="orderId" label="Order ID" name="orderId" type="text" />
                    </form>

                </Col>
            </Row>);
    }
}
