import  React from "react";
import {ButtonLink} from 'components/common/bootstrap';
import Icon from 'react-fa';

export class EditButtonLink extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {
        return (<ButtonLink bsStyle="primary" {...this.props}>
                    <Icon name="edit" />
                </ButtonLink>);
    }
};

export class AddButtonLink extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {
        return (<ButtonLink bsStyle="primary" {...this.props}>
                <Icon name="plus" />
                </ButtonLink>);
    }
};
