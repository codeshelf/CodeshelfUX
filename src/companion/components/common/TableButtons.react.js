import  React from "react";
import {ButtonLink} from '../../pages/links.js';
import Icon from 'react-fa';

export class EditButtonLink extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {
        return (<ButtonLink title="Edit" bsStyle="primary" {...this.props}>
                    <Icon name="edit" />
                </ButtonLink>);
    }
};

export class AddButtonLink extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {
        return (<ButtonLink bsStyle="primary" {...this.props} id="add" >
                <Icon name="plus" />
                </ButtonLink>);
    }
};
