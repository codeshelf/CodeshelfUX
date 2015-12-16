import {Map} from "immutable";
import {Row, Col} from 'components/common/pagelayout';
import {Form, Input, WrapInput, MultiSelect, SubmitButton, getRefInputValue} from 'components/common/Form';
import DayOfWeekFilter from 'components/common/DayOfWeekFilter';
import {getFacilityContext} from "data/csapi";

export default class EventSearch extends React.Component {

    constructor(props){
        super(props);
        this.state = {filter: Map(),
                      purposeOptions: []};
    }

    componentWillMount() {
        getFacilityContext().getEventPurposes().then((searchSpec) => {
          this.setState({purposeOptions: searchSpec.purpose});
        });
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
      let {filter, purposeOptions} = this.state;
      return (
        <Form onSubmit={(e) => {e.preventDefault(); return onSubmit(filter);}} >
          <WrapInput label="Timestamp">
            <DayOfWeekFilter  numDays={4} onChange={this.handleChange.bind(this, "createdInterval")}/>
          </WrapInput>
          {purposeOptions.length > 0 &&
            <MultiSelect
              label="Purpose"
              options={purposeOptions}
              values={purposeOptions.map((o) => o.value)}
              onChange={this.handleChange.bind(this, "purpose")}/>
          }
            <SubmitButton label="Search"/>
        </Form>
        );
    }
}
