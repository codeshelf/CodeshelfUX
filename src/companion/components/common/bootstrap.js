import  React from 'react';
import {ButtonLink}  from 'react-router-bootstrap';
import {Button as RButton}  from 'react-bootstrap';
import _ from 'lodash';
import exposeRouter from 'components/common/exposerouter';

class CSButtonLink extends React.Component{

    render() {
        var allParams = {};
        var propsWithoutParams = {};
        var currentParams = this.props.router.getCurrentParams();
        let {params} = this.props;
        _.merge(allParams, currentParams, params);
        _.merge(propsWithoutParams, this.props);
        delete propsWithoutParams.params;
        return (<ButtonLink params={allParams} {...propsWithoutParams} />);
    }
};

export default {
    ButtonLink: exposeRouter(CSButtonLink),
    Button: RButton
}
