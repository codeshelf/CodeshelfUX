import {Map} from "immutable";
import {Row, Col} from 'components/common/pagelayout';
import {Form, Input, WrapInput, MultiSelect, SubmitButton, getRefInputValue} from 'components/common/Form';
import DayOfWeekFilter from 'components/common/DayOfWeekFilter';

export default class EventSearch extends React.Component {

    constructor(props){
        super(props);
        this.state = {filter: Map()};
        this.purposeOptions = [
          {label: "Pick Outbound", value: "WiPurposeOutboundPick"},
          {label: "Put Palletizer", value: "WiPurposePalletizerPut"},
          {label: "<Unspecified>", value: null}
        ];
    }

    componentWillMount() {
        this.handleChange("createdInterval", 0);
    }

    handleChange(name, value) {
      if (name == "createdInterval") {
          value = DayOfWeekFilter.priorDayInterval(value);
      }
      this.setState({filter: this.state.filter.set(name, value)}, () =>{
        this.props.onFilterChange && this.props.onFilterChange(this.state.filter);
      });
    }

    render() {
      let {onSubmit} = this.props;
      let {filter} = this.state;
      return (
        <Form onSubmit={(e) => {e.preventDefault(); return onSubmit(filter);}} >
          <WrapInput label="Timestamp">
            <DayOfWeekFilter  numDays={4} onChange={this.handleChange.bind(this, "createdInterval")}/>
          </WrapInput>
          <MultiSelect
              label="Purpose"
              options={this.purposeOptions}
              values={this.purposeOptions.map((o) => o.value)}
              onChange={this.handleChange.bind(this, "purpose")}/>
            <SubmitButton label="Search"/>
        </Form>
        );
    }
}
