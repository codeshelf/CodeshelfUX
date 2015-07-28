import React from 'react';
import _ from 'lodash';
import DocumentTitle from 'react-document-title';
import {Modal, Input} from 'react-bootstrap';
import Icon from 'react-fa';
import Immutable from 'immutable';
import {RouteHandler} from 'react-router';
import PureComponent from 'components/common/PureComponent';
import {SingleCellLayout, Row, Col} from 'components/common/pagelayout';
import {IBox, IBoxBody, IBoxTitleBar, IBoxTitleText} from 'components/common/IBox';
import ListView from "components/common/list/ListView";
import {EditButtonLink, AddButtonLink} from 'components/common/TableButtons';

import {fetchWorkers} from 'data/workers/actions';
import {getWorkers} from 'data/workers/store';

import exposeRouter from 'components/common/exposerouter';

export default class WorkerMgmt extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            search: {
                query: "",
                column: ""
            }
        };
            this.columnMetadata = ListView.toColumnMetadata([
            {
                columnName: "persistentId",
                displayName: "UUID"
            },
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
        ]);
        let {state} = props;
        this.columnsCursor  = state.cursor(["preferences", "workers", "table", "columns"]);
        this.columnSortSpecsCursor = state.cursor(["preferences", "workers", "table", "sortSpecs"]);

    }


    componentWillMount() {
        fetchWorkers();
    }

    handleSearchChange(searchStruct) {
        this.setState(searchStruct);
    }

    toSearchColumns() {
        return this.columnMetadata.map((c) => {
            return c.update("search", (search) => {
                if (search == null) {
                    return c.customComponent.search;
                } else {
                    return search;
                }
            });
        });
    }

    search(search, columns, data) {
        let {query, columnName} = search;
        var dataSeq = new Immutable.Seq(Immutable.fromJS(data));
        if(!query) {
            return dataSeq;
        }

        if(columnName !== 'all') {
            columns = columns.filter((col) =>
                col.columnName === columnName
            );
        }

        return dataSeq.filter((row) =>
            columns.filter(isColumnVisible.bind(null, row)).count() > 0
        );

        function isColumnVisible(row, col) {
            var {columnName, search = (v) => v} = col;
            var value = row.get(columnName);
            var formattedValue = search(value);

            if (!formattedValue) {
                return false;
            }

            if(!_.isString(formattedValue)) {
                formattedValue = formattedValue.toString();
            }

            // TODO: allow strategy to be passed, now just defaulting to infix
            return formattedValue.toLowerCase().indexOf(query.toLowerCase()) >= 0;
        }

    }

    render() {
        var rows = getWorkers();
        let title = "Manage Workers";
        var searchData = this.search(
            this.state.search,
            this.columnMetadata,
            rows
        );
        return (<SingleCellLayout title={title}>
                   <IBox>
                                <IBoxBody>
                                    <Row>
                                        <Col sm={3}>
                                            <Search columns={this.columnMetadata} onChange={this.handleSearchChange.bind(this)}/>
                                        </Col>
                                        <Col sm={9} >
                                            <div className="pull-right">
                                                <AddButtonLink to="workernew" >
                                                </AddButtonLink>
                                            </div>
                                        </Col>
                                    </Row>
                                        <ListView results={searchData}
                                                keyColumn="persistentId"
                                                columns={this.columnsCursor}
                                                columnMetadata={this.columnMetadata}
                                                sortSpecs={this.columnSortSpecsCursor}
                                    />
                                </IBoxBody>
                            </IBox>
                            <RouteHandler formMetadata={this.columnMetadata}/>
                  </SingleCellLayout>
               );
    }


};

class Search extends React.Component {

    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {

        var query = React.findDOMNode(this.refs.query).getElementsByTagName("input")[0];
        var column = React.findDOMNode(this.refs.column);
        (this.props.onChange)({
            search: {
                query: query.value,
                columnName: column.value
            }
        });
    }

    render(){
            return <Input ref="query" type='text' onChange={this.handleChange} placeholder="Type to search" addonBefore={
                        <SearchColumns ref="column" onChange={this.handleChange} columns={this.props.columns}/>
                        } />

    }
}

class SearchColumns extends PureComponent {


    render() {
        return (<select onChange={this.props.onChange}>
                     <option key="all" value="all">All</option>
                     {
                         this.props.columns.map((column) =>{
                             let {columnName, displayName} = column;
                             return <option key={columnName} value={columnName}>{displayName}</option>
                         })
                     }
            </select>);
    }

}

class Edit extends React.Component {
    render() {
        var formData = this.props.rowData;
        var persistentId = formData.get("persistentId");
        return (<EditButtonLink to="workerdisplay"
                            params={{workerId: persistentId}}>
                </EditButtonLink>);
    }

}

import {formatTimestamp} from 'lib/timeformat';
class DateDisplay extends React.Component {
    static search(value) {
        return formatTimestamp(value);
    }

    render() {
        return (<span>{formatTimestamp(this.props.rowData.get("updated"))}</span>);
    }
}
