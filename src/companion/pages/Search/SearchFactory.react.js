import React, {Component, PropTypes} from 'react';
import {Nav, NavItem, Grid, Row, Col, Button, Input, ListGroup} from 'react-bootstrap';
import Icon from 'react-fa';
import {Link} from '../links';
import {SearchInput} from "./SearchInput.react.js";
import * as csapi from 'data/csapi';
import {IBox} from '../IBox.react.js';
import Infinite from 'react-infinite';

export function createSearchComponent(ItemComponent, searchFieldText, getIdForItem) {


  class SearchList extends Component {
    render() {
      const {isLoading, error, result, filter: {text: filterText}} = this.props;
      const headerLength = 210; // for now bulgaria constant
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
        <div>
          <Row>
            <Col sm={12}>
              Number of results: { result.total }
              <Infinite containerHeight={screen.height - headerLength} 
                        elementHeight={40}
                        infiniteLoadBeginEdgeOffset={undefined}
                        displayBottomUpwards={false}
                        useWindowAsScrollContainer={false}>
                {result.results.map((oneResult) => {
                  return <ItemComponent key={getIdForItem(oneResult)} {...oneResult} 
                                        filterText={filterText} />
                })}
              </Infinite>
            </Col>
          </Row>
        </div>
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
        <div>
          {/*<SearchType />*/}
          <IBox loading={isLoading} reloadFunction={acChangeFilter} data={filter.text}>
            <SearchInput  placeholder={searchFieldText} {...{filter, acChangeFilter, acSearch}} />
            <SearchList {...{isLoading, result, filter, error, acChangeFilter}} />
          </IBox>
        </div>
      );
    }
  }

  return SearchComponent;
}
