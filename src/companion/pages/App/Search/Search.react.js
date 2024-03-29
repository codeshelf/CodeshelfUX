import React, {Component, PropTypes} from 'react';
import {Nav, NavItem, Grid, Row, Col, Button, Input, ListGroup, Table} from 'react-bootstrap';
import {SingleCellLayout} from 'components/common/pagelayout';
import {IBox} from 'pages/IBox';
import Icon from 'react-fa';
import {SearchInput} from "../../Search/SearchInput.react.js";
import * as csapi from 'data/csapi';

export function createSearchComponent(ItemComponent, searchFieldText, getIdForItem) {

  class SearchList extends Component {
    render() {
      const {isLoading, error, result, filter: {text: filterText}} = this.props;
      if (isLoading) {
        return <div> Loading...</div>;
      } else if (error) {
        let text = "Can't load request";
        if (error instanceof csapi.ConnectionError || error.message) {
          text = error.message;
        }
        return (
          <Row>
            <Col xs={8}>
              Error: {text}
            </Col>
            <Col xs={4}>
              <Button bsStyle="primary" bsSize="xs" onClick={() => this.props.acChangeFilter(this.props.filter.text)}><Icon name="refresh" /></Button>
            </Col>
          </Row>
        );
      } else if (result === null) {
        return <div>No results</div>;
      }
      return (
        <Row>
          <Col sm={12}>
            Number of results: { result.total }
            <Table>
              {/* TODO Add head maybe? */}
              <tbody>
            {result.results.map((oneResult) => {
              return <ItemComponent key={getIdForItem(oneResult)} {...oneResult} filterText={filterText} />
            })}
              </tbody>
            </Table>
            {/*"Orders:" + JSON.stringify(result)*/}
          </Col>
        </Row>
      );
    }
  }


  class SearchComponent extends Component {
/*
    componentWillMount() {
      if (this.props.filter.text === null) {
        this.props.acChangeFilter("");
      } else {
        this.props.acChangeFilter(this.props.filter.text);
      }
    }
*/
    render() {
      const {whatIsLoading, error, result, filter} = this.props;
      const {acChangeFilter, acSearch} = this.props;

      const isLoading = (whatIsLoading !== null);
      return (
        <SingleCellLayout>
          <IBox>
            <SearchInput  placeholder={searchFieldText} {...{filter, acChangeFilter, acSearch}} />
            <SearchList {...{isLoading, result, filter, error, acChangeFilter}} />
          </IBox>
        </SingleCellLayout>
      );
    }
  }

  return SearchComponent;
}
