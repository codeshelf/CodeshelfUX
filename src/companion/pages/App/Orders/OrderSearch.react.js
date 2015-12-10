import {Row, Col} from 'components/common/pagelayout';
import {Form, Input, WrapInput, SubmitButton, getRefInputValue} from 'components/common/Form';
import DayOfWeekFilter from 'components/common/DayOfWeekFilter';

function globSubstring(substring) {
  if (substring && substring.indexOf('*') < 0) {
    return "*" + substring + "*";
  } else {
    return substring;
  }
   }


export default class OrderSearch extends React.Component {

    constructor(props){
        super(props);
        this.state = {};
    }

    getFilter() {

        let orderIdSubstring = globSubstring(getRefInputValue(this.refs.orderId));
        let  filter = {
            orderId: orderIdSubstring,
            properties: ["orderId"]
        };
        let interval = this.refs.dueDateFilter.getInterval();
        if (interval) {
            filter['dueDate'] = interval.toQueryParameterValue();
        }
        return filter;
    }

    handleSubmit(e) {
        e.preventDefault();
        return this.fireFilterChange();
    }

    handleChange(daysBack) {
        this.fireFilterChange();
    }

    fireFilterChange() {
        let  filter = this.getFilter();
        return this.props.onFilterChange(filter);
    }

    render() {
        return (
            <Form onSubmit={this.handleSubmit.bind(this)}>
                <WrapInput label="Due Date">
                    <DayOfWeekFilter ref="dueDateFilter" numDays={4} onChange={this.handleChange.bind(this)}/>
                </WrapInput>
                <Input ref="orderId" label="Order ID" name="orderId" type="text" />
                <SubmitButton label="Search"/>
            </Form>
        );
    }
}
