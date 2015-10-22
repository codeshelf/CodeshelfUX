import  React from "react";
import ListManagement from "components/common/list/ListManagement";
import ListView from "components/common/list/ListView";
    import {Form, SubmitButton, Input, getRefInputValue} from "components/common/Form";
import {properties, keyColumn} from "data/types/DailyMetric";
import {fromJS, List} from "immutable";
import {getFacilityContext} from "data/csapi";
export default class DailyMetrics extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            results: List(),
            columnMetadata: ListView.toColumnMetadataFromProperties(properties)
        };
    }

    componentDidMount() {
        getFacilityContext().getMetrics().then((metrics) => {
            this.setState({results: metrics});
        });
    }

    handleSubmit() {
        let date =  getRefInputValue(this.refs.date);
        return getFacilityContext().computeMetrics(date).then(() => {
            this.componentDidMount();
        });
    }

    render() {
        const {results, columnMetadata} = this.state;
        let columnsCursor  = this.props.appState.cursor(["preferences", "dailymetric", "table", "columns"]);

        return (
            <div>
                <Form onSubmit={this.handleSubmit.bind(this)}>
                    <Input ref="date" name="date" label="Date" />
                    <SubmitButton label="Recompute" />
                </Form>
                <ListManagement
                    results={results}
                    keyColumn="date"
                    columns={columnsCursor}
                        columnMetadata={columnMetadata} />
           </div>
        );
    }
};
