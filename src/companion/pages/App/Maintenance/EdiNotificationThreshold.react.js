import React from 'react';
import _ from 'lodash';
import {Map, List, fromJS} from 'immutable';
import {getAPIContext} from 'data/csapi';
import {SingleCellIBox, IBoxSection} from 'components/common/IBox';
import {SingleCellLayout, Row, Col} from 'components/common/pagelayout';
import {Modal} from 'react-bootstrap';
import {Button, List as BSList} from 'components/common/bootstrap';
import {Form, Input, Checkbox, ErrorDisplay} from 'components/common/Form';
import Icon from 'react-fa';
import {Table} from 'components/common/Table';
import Dropzone from 'react-dropzone';

import ParameterSetConfiguration from "./ParameterSetConfiguration";

export default class EdiNotificationThreshold extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
        this.loadConfiguration();
    }

    loadConfiguration(){
        return getAPIContext().getHealthCheckConfiguration("ParameterEdiFreeSpaceHealthCheck").then((data)=>{
            this.setState({"healthcheck": data});
            return data;
        });
    }

    render() {
        const {healthcheck} = this.state;
        return (<SingleCellIBox title="Edi Free Space Health Check">
                    <ParameterSetConfiguration
                        parameterType="ParameterEdiFreeSpaceHealthCheck"
                        healthcheck={healthcheck}
                        onUpdate={this.loadConfiguration.bind(this)}
                     />
                </SingleCellIBox>
        );
    }
};
