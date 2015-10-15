import  React from "react";
import {SingleCellIBox} from "components/common/IBox.react.js";
import {Form, Input, getRefInputValue, SubmitButton} from "components/common/Form";
import {Row, Col} from "components/common/pagelayout";
import {getFacilityContext} from "data/csapi";

export default class TestFunctionExecution extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            "testFunctionResult" : null
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit() {
        let functionName = getRefInputValue(this.refs.functionName);
        let paramString = getRefInputValue(this.refs.parameters);
        let parameters = {};
        if (paramString) {
            parameters = paramString.split('&').reduce((params, pair) => {
                let nameValue = pair.split('=');
                params[nameValue[0]] = nameValue[1];
                return params;
            }, {});
        }
        return getFacilityContext().executeTestFunction(functionName, parameters).then((result) => {
            this.setState({"testFunctionResult" : result});
        });
    }

    render() {
        let {testFunctionResult} = this.state;
        return (<SingleCellIBox title="Test Function Execution">
                <Row>
                    <Col md={6}>
                        <Form onSubmit={this.handleSubmit}>
                            <Input ref="functionName" label="Function Name" name="functionName" required={true} type="text" />
                            <Input ref="parameters" type="text" label="Function Parameters (name=value&name=value)" name="parameters"/>
                            <SubmitButton label="Execute"/>
                        </Form>
                    </Col>
                    <Col sm={6}>
                        <pre>
                                {testFunctionResult}
                        </pre>
                    </Col>
                </Row>
                </SingleCellIBox>
               );
    }
};
