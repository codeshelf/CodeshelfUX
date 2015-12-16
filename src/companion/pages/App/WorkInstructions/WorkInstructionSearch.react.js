import {Form, Select, Input, WrapInput, SubmitButton, getRefInputValue} from 'components/common/Form';
import DayOfWeekFilter from 'components/common/DayOfWeekFilter';

function globSubstring(substring) {
  if (substring && substring.indexOf('*') < 0) {
    return "*" + substring + "*";
  } else {
    return substring;
  }
}


export default class WorkInstructionSearch extends React.Component {

    constructor(props){
        super(props);
        this.state = {};
    }

    getFilter() {
        let itemIdSubstring = globSubstring(getRefInputValue(this.refs.sku));
        let containerIdSubstring = globSubstring(getRefInputValue(this.refs.containerId));
        let  filter = {
            itemId: itemIdSubstring,
            containerId: containerIdSubstring
            //properties: ["orderId"]
        };
        let interval = this.refs.assignedFilter.getInterval();
        if (interval) {
            filter['assigned'] = interval.toQueryParameterValue();
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
                <WrapInput label="Assigned Time">
                    <DayOfWeekFilter ref="assignedFilter" numDays={4} onChange={this.handleChange.bind(this)}/>
                </WrapInput>
                <Input ref="sku" label="SKU" name="itemId" type="text" />
                <Input ref="containerId" label="Container ID" name="containerId" type="text" />
                <SubmitButton label="Search"/>
            </Form>
            );
    }
}
