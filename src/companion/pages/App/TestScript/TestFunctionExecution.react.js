import  React from "react";
import {SingleCellIBox} from "components/common/IBox.react.js";

import {Form, Input, getRefInputValue} from "components/common/Form";
import {Row, Col} from "components/common/pagelayout";
import {Button} from "components/common/bootstrap";
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
        let parameters = getRefInputValue(this.refs.parameters);
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
                            <Button type="submit" bsStyle="primary">Execute</Button>
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
