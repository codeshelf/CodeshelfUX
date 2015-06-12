import  React from "react";
import {ButtonLink} from 'components/common/bootstrap';
import Icon from 'react-fa';

export default class EditButtonLink extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {
        return (<ButtonLink bsStyle="primary" {...this.props}>
                    <Icon name="edit" />
                </ButtonLink>);
    }
};
