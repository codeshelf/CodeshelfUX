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

const ColumnRecord = Record({
    columnName: null,
    displayName: null,
    customComponent: null
});
const SortSpec = Record({
    property: null,
    direction: "asc",
    sortFunction: ascFunc
});

function toFullSortSpecs(columns = new Seq(), sortSpecs = new Map()) {
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

    static setCustomComponent(propertyName, CustomComponent, columnMetadata) {
        return columnMetadata.map((c) => {
            if (c.get('columnName') === propertyName) {
                return c.set("customComponent", CustomComponent);
            } else {
                return c;
            }
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

    getCSV() {
        return this.refs.table.getCSV();
    }

    render() {

        let {columnMetadata,
             columns,
             keyColumn,
             rowActionComponent,
             expand,
             onRowExpand,
             onRowCollapse} = this.props;

        let {results,
             sortSpecs = new Map()} = this.props;

        if (!columns) {
            columns = columnMetadata.map((m) => { return m.columnName;});
        }
        let columnArray = [];
        if (typeof columns === "function") {
            columnArray = columns();
        } else {
            columnArray = columns;
        }


        const sortBy = Seq(toFullSortSpecs(columnArray, fromJS(sortSpecs)));
        results = this.props.results.sort((a, b) => {
            let comp =  sortBy.map(({sortFunction, property}) => {
                return sortFunction(a.get(property), b.get(property));
            })
            .find((result) => result !=0) || 0;
            return comp;
        });
        return (<div className="listview">
                <Row >
                    <Col sm={6} >
                        <div className="pull-left text-left">
                            Total: {results.count()}
                        </div>
                    </Col>
                    <Col sm={6} >
                        <div className="pull-right">
                            <TableSettings onColumnsChange={(columns) => this.props.onChange(columns, this.props.storeName)}
                                columns={columnArray}
                                columnMetadata={columnMetadata} />
                        </div>
                    </Col>
                 </Row>
                <Table ref="table" results={results}
                    columns={columnArray}
                    columnMetadata={columnMetadata}
                    keyColumn={keyColumn}
                    rowActionComponent={rowActionComponent}
                    sortedBy={sortBy}
                    onColumnMove={this.props.onColumnMove}
                    onColumnSortChange={this.props.onColumnSortChange}
                    {...{expand, onRowExpand, onRowCollapse}}
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
                <DropdownButton id="table-settings" className="settings pull-right" title={<Icon name="gear" />}>
                    <MultiSelectUnwrapped options={options} values={columns} onChange={onColumnsChange}/>
                </DropdownButton>
        );
    }
}

ListView.TableSettings = TableSettings;
ListView.ColumnRecord = ColumnRecord;
ListView.propTypes = {
    columns: React.PropTypes.object,
    columnMetadata: ImmutablePropTypes.iterable.isRequired,
    sortSpecs: React.PropTypes.object,
    keyColumn: React.PropTypes.string.isRequired,
    results: ImmutablePropTypes.iterable
};
