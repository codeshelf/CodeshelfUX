import  React from "react";
import DocumentTitle from "react-document-title";
import {Row, Col} from 'components/common/pagelayout';
import {Input} from 'react-bootstrap';

import {SingleCellIBox} from 'components/common/IBox';
import PureComponent from 'components/common/PureComponent';
import {EditButtonLink, AddButtonLink} from 'components/common/TableButtons';
import ListView from "./ListView";
import Immutable from 'immutable';

export default class ListManagement extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            search: {
                query: "",
                column: ""
            }
        };
        this.handleSearchChange = this.handleSearchChange.bind(this);
    }

    static toEditButton(editButtonPropsFn: Function) {
        class Edit extends React.Component {
            render() {
                var row  = this.props.rowData;
                return (<EditButtonLink {...editButtonPropsFn(row)}>
                        </EditButtonLink>);
            }

        }
        return Edit;
    }


    handleSearchChange(searchStruct) {
        this.setState(searchStruct);
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
        let {columnMetadata
             , addButtonRoute
             , results
             , ...other} = this.props;

        var filteredResults = this.search(
            this.state.search,
            columnMetadata,
            results);

        return (
            <SingleCellIBox>
                <Row>
                    <Col sm={3}>
                            <Search columns={columnMetadata} onChange={this.handleSearchChange}/>
                    </Col>
                    <Col sm={9} >
                        <div className="pull-right">
                            {(addButtonRoute) && <AddButtonLink to={addButtonRoute} />}
                        </div>
                    </Col>
                </Row>
                <ListView {...other} results={filteredResults} columnMetadata={columnMetadata}/>
            </SingleCellIBox>);
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
