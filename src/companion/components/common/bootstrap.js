import React from 'react';
import {ButtonLink as RButtonLink} from 'react-router-bootstrap';
import {Button as RButton} from 'react-bootstrap';
import _ from 'lodash';
import exposeRouter from 'components/common/exposerouter';

class CSButtonLink extends React.Component{

    render() {
        var allParams = {};
        var propsWithoutParams = {};
        var currentParams = this.props.params;
        let {params} = this.props;
        _.merge(allParams, currentParams, params);
        _.merge(propsWithoutParams, this.props);
        delete propsWithoutParams.params;
        return (<RButtonLink params={allParams} {...propsWithoutParams} />);
    }
};
export const ButtonLink = exposeRouter(CSButtonLink);
export const Button = RButton;
export class List extends React.Component {
    render() {
        let {values, label} = this.props;
        return (
            (values && values.length > 0) ?
            <div>
                <div>{label}</div>
                <ul>
                    {_.map(values, (value) => {
                        return <li>{value}</li>;
                    })}
                </ul>
            </div>
            :
            null
        );
    }
};
