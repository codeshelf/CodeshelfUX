import  React from "react";
import {RouteHandler} from "react-router";
import exposeRouter from 'components/common/exposerouter';
import {Map, List, fromJS} from 'immutable';
import {SingleCellLayout, Row, Col} from 'components/common/pagelayout';
import {WrapInput, Input, Checkbox, ErrorDisplay} from 'components/common/Form';
import {Button, List as BSList} from 'components/common/bootstrap';
import Icon from 'react-fa';
import {getFacilityContext} from 'data/csapi';
import {EditButtonLink} from "components/common/TableButtons";

class ParameterSetConfiguration extends React.Component{

    constructor(props) {
        super(props);
        this.parameterType = this.props.parameterType;
        this.handleExtensionPointUpdate = this.handleExtensionPointUpdate.bind(this);
    }

    addToEdit() {
            return getFacilityContext().addExtensionPoint({type: this.parameterType})
            .then((newExtensionPoint) => {
                let params = this.props.router.getCurrentParams();
                    params.parameterType = this.parameterType;
                    this.props.router.transitionTo("parametersetedit", params);
            });
    }

    handleExtensionPointUpdate(extensionPoint) {
        return getFacilityContext().updateExtensionPoint(extensionPoint.toJS()).then((updatedExtensionPoint) => {
            return this.props.onUpdate();
        });
    }



    handleChange(extensionPoint, active, e) {
        if (extensionPoint) {
            return this.handleExtensionPointUpdate(extensionPoint.set("active", active));
        } else {
            return null;
        }

    }

    render() {
        let {parameterType, configuration = {}} = this.props;
        let {parameterSet = {}, extensionPoint} = configuration;
        extensionPoint = fromJS(extensionPoint);
        let {purgeAfterDays} = parameterSet;
        let useDefaults = true;
        var extensionPointId = null;
        if (extensionPoint) {
            useDefaults = !extensionPoint.get("active");
            extensionPointId = extensionPoint.get("persistentId");
        }
        return (
                    <Row>
                        <Col md={8}>
                            <pre>{parameterSet.parametersDescription}</pre>
                        </Col>
                        <Col md={4}>
                            <form>
                            {(extensionPointId) ?
                                <div>
                                    <Checkbox name={parameterType + "useDefaults"} id={parameterType + "useDefaults"} label="Use Defaults" value={useDefaults} onChange={this.handleChange.bind(this, extensionPoint, useDefaults)} />

                                    <EditButtonLink name="edit" to="parametersetedit" params={{parameterType: parameterType}} disabled={useDefaults} />
                                </div>
                               :
                                <WrapInput label="Change Configuration">
                                    <Button name="addFirst" bsStyle="primary" onClick={this.addToEdit.bind(this)}><Icon name="edit" /></Button>
                                </WrapInput>
                            }
                            </form>

                        </Col>
                    </Row>

                  );
                 }
                };
export default exposeRouter(ParameterSetConfiguration);
