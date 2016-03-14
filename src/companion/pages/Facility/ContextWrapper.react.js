import React, {Component} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import exposeRouter from 'components/common/exposerouter';
import {RouteHandler} from 'react-router';

import {acInitialLoadFacilities, acSelectContext} from './store';
import {acToggleSidebar} from '../Sidebar/store';
import {getFacilityMutable} from "./get";
import {getSidebarMutable} from "../Sidebar/get";


class ContextWrapper extends Component {

  componentWillMount() {
    this.selected = this.props.selected;
  }

  componentDidMount() {
    const {availableFacilities} = this.props;
    if (availableFacilities === null) {
      this.props.acInitialLoadFacilities();
    } else {
      this.selectFacilityFromRoute(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.selectFacilityFromRoute(nextProps);
    // refresh after context change
    if (this.selected.selectedFacility !== null && !_.isEqual(this.selected, nextProps.selected)) {
      this.selected = nextProps.selected;
      window.location.reload();
    }
    if (this.selected.selectedFacility === null) {
      this.selected = nextProps.selected;
    };
  }

  selectFacilityFromRoute(props) {
     const {facilityName, customerName} = props.params;
     this.props.acSelectContext({domainId: facilityName, customerId: customerName});
  }

  renderLoading(a) {
    return <div>Selecting Facility...{(a)? a : ""}</div>;
  }

  render() {
    // if we are going directly to this route we must first load facilities
    if (this.props.loadingAvailableFacilities) return this.renderLoading();
    // if haven't selected facility render loading
    // after loading this component will refresh and in DidUpdate we will select correct facility
    const {selected, availableFacilities, acSelectContext, acToggleSidebar, isOpen} = this.props;
    if (!selected.selectedFacility) {
      return this.renderLoading(".");
    } else {
      return React.cloneElement(this.props.children, {
        key: selected.selectedFacility.persistentId,
        selected: selected,
        availableFacilities,
        acSelectContext,
        acToggleSidebar,
        isOpen
      });
    }
  }
}

function getState(state) {
  return {
    ...getFacilityMutable(state),
    ...getSidebarMutable(state),
  }
}

function mapDispatch(dispatch) {
  return bindActionCreators({acInitialLoadFacilities, acSelectContext, acToggleSidebar}, dispatch);
}

export default exposeRouter(connect(getState, mapDispatch)(ContextWrapper));
