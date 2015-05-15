import React from 'react';
import _ from 'lodash';
import DocumentTitle from 'react-document-title';
import {Modal, Input} from 'react-bootstrap';
import Icon from 'react-fa';
import Immutable from 'immutable';
import {RouteHandler} from 'react-router';

import {PageGrid, Row, Col} from 'components/common/pagelayout';
import {IBox, IBoxBody, IBoxTitleBar, IBoxTitleText} from 'components/common/IBox';
import {Table} from 'components/common/Table';
import {ButtonLink} from 'components/common/bootstrap';

import {fetchWorkers} from 'data/workers/actions';
import {getWorkers} from 'data/workers/store';

import exposeRouter from 'components/common/exposerouter';

export default class WorkerMgmt extends React.Component{

    constructor() {
        super();
        this.state = {
            search: {
                query: "",
                column: ""
            }
        };
        this.columnMetadata = [
            {
                columnName: "lastName",
                displayName: "Last"
            },
            {
                columnName: "firstName",
                displayName: "First"
            },
            {
                columnName: "middleInitial",
                displayName: "M"
            },
            {
                columnName: "badgeId",
                displayName: "Badge"
            },
            {
                columnName: "hrId",
                displayName: "HR ID"
            },
            {
                columnName: "groupName",
                displayName: "Group"
            },
            {
                columnName: "updated",
                displayName: "Updated",
                customComponent: DateDisplay
            },
            {
                columnName: "action",
                displayName: "",
                customComponent: Edit
            }
        ];
        this.columns = _.map(this.columnMetadata, (column) => column.columnName);
    }


    componentWillMount() {
        fetchWorkers();
    }

    handleSearchChange(searchStruct) {
        this.setState(searchStruct);
    }

    toSearchColumns() {
        return _.map(this.columnMetadata, (c) => {
            return {property: c.columnName,
                    header: c.displayName,
                    search: c.search || (c.customComponent) ? c.customComponent.search : null};
        });
    }

    search(search, columns, data) {
        var query = search.query;
        var column = search.column;

        if(!query) {
            return data;
        }

        if(column !== 'all') {
            columns = _.filter(columns, (col) =>
                col.property === column
            );
        }

        return _.filter(data, (row) =>
            _.filter(columns, isColumnVisible.bind(this, row)).length > 0
        );

        function isColumnVisible(row, col) {
            var property = col.property;
            var value = row[property];
            var defaultFunction = (v) => {return v;};
            var formatter = col.search || defaultFunction;
            var formattedValue = formatter(value);

            if (!formattedValue) {
                return false;
            }

            if(!_.isString(formattedValue)) {
                formattedValue = formattedValue.toString();
            }

            // TODO: allow strategy to be passed, now just defaulting to infix
            return formattedValue.indexOf(query.toLowerCase()) >= 0;
        }

    }

    render() {
        var rows = getWorkers();
        let title = "Manage Workers";
        var searchData = this.search(
            this.state.search,
            this.toSearchColumns(),
            rows
        );
        return (<DocumentTitle title={title}>
                <PageGrid>
                    <Row>
                        <Col sm={12}>
                            <IBox>
                                <IBoxBody>
                                    <Row>
                                        <Col sm={3}>
                                            <Search columns={this.toSearchColumns()} onChange={this.handleSearchChange.bind(this)}/>
                                        </Col>
                                        <Col sm={9} >
                                            <div className="pull-right">
                                                <ButtonLink bsStyle="primary" to="workerdisplay" params={{workerId: "new"}} >
                                                    <Icon name="plus" />
                                                </ButtonLink>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Table results={searchData}
                                        columns={this.columns}
                                        columnMetadata={this.columnMetadata}
                                    />
                                </IBoxBody>
                            </IBox>
                            <RouteHandler formMetadata={this.columnMetadata}/>
                        </Col>
                    </Row>
                </PageGrid>
                </DocumentTitle>
               );
    }


};

class Search extends React.Component {
    handleChange(e) {

        var query = React.findDOMNode(this.refs.query).getElementsByTagName("input")[0];
        var column = React.findDOMNode(this.refs.column);
        (this.props.onChange)({
            search: {
                query: query.value,
                column: column.value
            }
        });
    }

    render(){
            return <Input ref="query" type='text' onChange={this.handleChange.bind(this)} placeholder="Type to search" addonBefore={
                        <SearchColumns ref="column" onChange={this.handleChange.bind(this)} columns={this.props.columns}/>
                        } />

    }
}

class SearchColumns extends React.Component {
    render() {
        return (<select>
                     <option value="all">All</option>
                     {
                         _.map(this.props.columns,(column) =>{
                             return <option value={column.property}>{column.header}</option>
                         })
                     }
            </select>);
    }

}

class Edit extends React.Component {
    render() {
        var formData = this.props.rowData;
        var persistentId = formData.get("persistentId");
        return (<ButtonLink bsStyle="primary"
                            to="workerdisplay"
                            params={{workerId: persistentId}}>
                    <Icon name="edit" />
                </ButtonLink>);
    }

}

import formatTimestamp from 'lib/timeformat';
class DateDisplay extends React.Component {
    static search(value) {
        return formatTimestamp(value);
    }

    render() {
        return (<span>{formatTimestamp(this.props.rowData.get("updated"))}</span>);
    }
}
