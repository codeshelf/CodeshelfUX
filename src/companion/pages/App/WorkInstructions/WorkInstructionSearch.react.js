import {Row, Col} from 'components/common/pagelayout';
import {Select, Input, WrapInput} from 'components/common/Form';
import Promise from "bluebird";
import _ from "lodash";
import DayOfWeekFilter from 'components/common/DayOfWeekFilter';

export default class WorkInstructionSearch extends React.Component {

    constructor(props){
        super(props);
        this.state = {};
    }

    getFilter() {
        let interval = this.refs.assignedFilter.getInterval();
        //let orderIdSubstring = React.findDOMNode(this.refs.orderId).getElementsByTagName("input")[0].value;
        let  filter = {
//            orderId: orderIdSubstring,
            properties: ["orderId"]
        };
        if (interval) {
            filter['assigned'] = interval.toQueryParameterValue();
        }
        return filter;
    }

    handleSubmit(e) {
        e.preventDefault();
        this.fireFilterChange();
    }

    handleDayChange(daysBack) {
        this.fireFilterChange();
    }

    fireFilterChange() {
        let  filter = this.getFilter();
        this.props.onFilterChange(filter);
    }

    render() {
        return (
            <Row>
                <Col md={6}>
                    <form onSubmit={this.handleSubmit.bind(this)}>
                        <WrapInput label="Assigned Time">
                            <DayOfWeekFilter ref="assignedFilter" numDays={4} onChange={this.handleDayChange.bind(this)}/>
                        </WrapInput>
                {/*                         <Input ref="orderId" label="Order ID" name="orderId" type="text" /> */}
                    </form>
                </Col>
            </Row>);
    }
}
