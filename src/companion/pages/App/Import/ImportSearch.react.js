import  React from "react";
import {Form, WrapInput, Input, SubmitButton, getRefInputValue} from 'components/common/Form';
import DayOfWeekFilter from 'components/common/DayOfWeekFilter';

function globSubstring(substring) {
  if (substring && substring.indexOf('*') < 0) {
    return "*" + substring + "*";
  } else {
    return substring;
  }
}

export default class ImportSearch extends React.Component{

    constructor(props){
        super(props);
        this.state = {};
    }

    getFilter() {
        let orderIdsSubstring = globSubstring(getRefInputValue(this.refs.orderIds));
        let itemIdsSubstring = globSubstring(getRefInputValue(this.refs.itemIds));
        let gtinsSubstring = globSubstring(getRefInputValue(this.refs.gtins));
        let  filter = {
            orderIds: orderIdsSubstring,
            itemIds: itemIdsSubstring,
            gtins: gtinsSubstring,
            properties: ["orderId"]
        };
        let interval = this.refs.receivedFilter.getInterval();
        if (interval) {
            filter['received'] = interval.toQueryParameterValue();
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
                    <WrapInput label="Received Date">
                        <DayOfWeekFilter ref="receivedFilter" numDays={4} onChange={this.handleChange.bind(this)} />
                    </WrapInput>
                    <Input type="text" ref="orderIds" label="Order IDs" name="orderIds" />
                    <Input type="text" ref="itemIds" label="Item IDs" name="itemIds" />
                    <Input type="text" ref="gtins" label="GTINs" name="gtins" />
                    <SubmitButton label="Search" />
                </Form>
        );
    }
};
