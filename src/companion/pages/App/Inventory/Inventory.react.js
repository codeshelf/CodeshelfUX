import React from 'react';
import DocumentTitle from 'react-document-title';
import {Grid, Row, Col} from 'react-bootstrap';

import {DropdownButton, MenuItem} from 'react-bootstrap';

export default class Inventory extends React.Component {
    componentDidMount() {
        console.log("mounted", this);
    }

    render() {

        return (
                <DocumentTitle title="Inventory">
                </DocumentTitle>
        );
    }

};
