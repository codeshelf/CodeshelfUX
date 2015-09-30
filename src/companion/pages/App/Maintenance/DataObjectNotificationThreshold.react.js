import React from 'react';
import _ from 'lodash';
import {Map, List, fromJS} from 'immutable';
import {getFacilityContext} from 'data/csapi';
import {SingleCellIBox, IBoxSection} from 'components/common/IBox';
import {SingleCellLayout, Row, Col} from 'components/common/pagelayout';
import {Modal} from 'react-bootstrap';
import {Button, List as BSList} from 'components/common/bootstrap';
import {Form, Input, Checkbox, ErrorDisplay} from 'components/common/Form';
import Icon from 'react-fa';
import {Table} from 'components/common/Table';
import Dropzone from 'react-dropzone';

function changeState(name, value, callback = () => {}) {
    let obj = new Object();
    obj[name] = value;
    this.setState(obj, callback);
}

export default class DataObjectNotificationThreshold extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {thresholdsDisplay = "reports", useDefaults = false} = this.state;
        return (
            <SingleCellIBox title="Notification Thresholds">
                <Row>
                    <Col md="8">
                            <pre>{thresholdsDisplay}</pre>
                    </Col>
                    <Col md="4">
                        <form>
                            <Checkbox name="useDefaults" label="Use Defaults" value={useDefaults} onChange={changeState.bind(this, "useDefaults", !useDefaults, null)} />
                                <Button type="button" disabled={useDefaults} bsStyle="primary"
                                    onClick={() => {}}>
                                Edit
                            </Button>

                        </form>

                    </Col>
                </Row>
            </SingleCellIBox>
        );
    }
};
