import  React from "react";
import {DropdownButton} from "react-bootstrap";
import ImmutablePropTypes from 'react-immutable-proptypes';

import Icon from "react-fa";
import _ from "lodash";
import {Map, List, fromJS, Record, Seq, Iterable} from "immutable";
import {Table} from "components/common/Table";
import {MultiSelectUnwrapped, Input} from 'components/common/Form';
import PureComponent from 'components/common/PureComponent';
import {Row, Col} from 'components/common/pagelayout';

import DateTime from "data/types/DateTime";
import DateDisplay from "components/common/DateDisplay";


let desc = (b) => b * -1;

let ascFunc = (a, b) => {
    if (a < b) return -1;
        if (a > b) return 1;
    return 0;
};


var SortSpec = Record({
    property: null,
    direction: "asc",
    sortFunction: ascFunc
});

function toFullSortSpecs(columns, sortSpecs) {
    return columns.reduce((fullSortSpecs, c) => {
        let columnName = c;
        let order = sortSpecs.getIn([columnName, "order"]);
        if (order) {
            return fullSortSpecs.push(SortSpec({direction: order, property: columnName}));
        } else {
            return fullSortSpecs;
        }

    }, List())
    .map((spec) => {
        if (spec.direction === "desc") {
            return spec.set("sortFunction",  _.compose(desc, ascFunc)); // compose = desc(ascFunc(a,b))
        } else {
            return spec.set("sortFunction", ascFunc);
        }
    });;
}

const ColumnRecord = Record({columnName: null, displayName: null, customComponent: null });

export default class ListView extends React.Component{

    constructor(props) {
        super(props);
    }

    static toColumnMetadata(arrayOfObjects) {
        return fromJS(arrayOfObjects, (key, value) => {
            if (Iterable.isKeyed(value)) {
                return new ColumnRecord(value);
            } else {
                return value;
            }
        });



    }

    static toColumnMetadataFromProperties(properties) {
        return properties.map((property) => {
            var  customComponent = null;
            if (property.type === DateTime) {
                customComponent = DateDisplay;
            }
            return new ColumnRecord({
                columnName: property.id,
                displayName: property.title,
                customComponent: customComponent
            });
        });

    }



    getAllSelected(select) {
        var result = [];
        var options = select && select.options;
        var opt;

        for (var i=0, iLen=options.length; i<iLen; i++) {
            opt = options[i];

            if (opt.selected) {
                result.push(opt.value || opt.text);
            }
        }
        return result;
    }

    handleColumnMove(moved, afterName) {

        this.props.columns((columns) => {
            let formerPosition = columns.indexOf(moved);
            let newPosition = columns.indexOf(afterName);
            let after = columns.splice(formerPosition, 1)
                    .splice(newPosition, 0, moved);
            return after;
        });
    }

    handleColumnSortChange(columnName, direction) {
            this.props.sortSpecs((oldSortSpec)=>{
                return oldSortSpec.set(columnName, Map({order: direction}));
            });
    }

    render() {

        let {columns, columnMetadata, keyColumn} = this.props;

        var {results, sortSpecs = () => {}} = this.props;

        var sortBy = null;
        if (typeof sortSpecs === 'function') {
            sortBy = Seq(toFullSortSpecs(columns(), sortSpecs()));
            results = this.props.results.sort((a, b) => {
                //find first non zero result as you run each sort function in order
                let comp =  sortBy.map(({sortFunction, property}) => {
                    return sortFunction(a.get(property), b.get(property));
                })
                .find((result) => result !=0) || 0;
                return comp;
            });
        }

        return (<div>
                <TableSettings onColumnsChange={columns}
                    columns={columns()}
                    columnMetadata={columnMetadata} />
                <Table results={results}
                    columns={columns()}
                    columnMetadata={columnMetadata}
                    keyColumn={keyColumn}
                    sortedBy={sortBy}
                    onColumnMove={this.handleColumnMove.bind(this)}
                    onColumnSortChange={this.handleColumnSortChange.bind(this)}

                 />
                </div>);
    }
};


class TableSettings extends PureComponent {

    render() {
        let {columns, columnMetadata, onColumnsChange} = this.props;
        let options = columnMetadata.map((columnMetadata) => {
            return {label: columnMetadata.get("displayName"), value: columnMetadata.get("columnName")};
        });

        return (
                <Row>
                <Col sm={12} >
                <DropdownButton className="pull-right" title={<Icon name="gear" />}>
                    <MultiSelectUnwrapped options={options} values={columns} onChange={onColumnsChange}/>
                </DropdownButton>
                </Col>
                </Row>

        );
    }
}

ListView.TableSettings = TableSettings;
ListView.ColumnRecord = ColumnRecord;
ListView.propTypes = {
    columns: React.PropTypes.func, //cursor
    columnMetadata: ImmutablePropTypes.iterable.isRequired,
    sortSpecs: React.PropTypes.func, //cursor
    keyColumn: React.PropTypes.string.isRequired,
    results: ImmutablePropTypes.iterable
};
