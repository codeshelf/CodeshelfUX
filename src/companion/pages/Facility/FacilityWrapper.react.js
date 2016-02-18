import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import exposeRouter from 'components/common/exposerouter';
import {acInitialLoadFacilities, acSelectFacility} from './store';
import {acToggleSidebar} from '../Mobile/Sidebar/store';
import {getFacilityMutable} from "./get";
import {getSidebarMutable} from "../Mobile/Sidebar/get";


class FacilityWrapper extends Component {

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
  }

  selectFacilityFromRoute(props) {
     const facilityName = props.params.facilityName;
     this.props.acSelectFacility(facilityName);
  }

  renderLoading(a) {
    return <div>Selecting Facility...{(a)? a : ""}</div>;
  }

  render() {
    // if we are going directly to this route we must first load facilities
    if (this.props.loadingAvailableFacilities) return this.renderLoading();
    // if haven't selected facility render loading
    // after loading this component will refresh and in DidUpdate we will select correct facility
    const {selectedFacility, availableFacilities, acSelectFacility, acToggleSidebar, isOpen} = this.props;
    if (!selectedFacility) {
      return this.renderLoading(".");
    } else {
      return React.cloneElement(this.props.children, {
        key: selectedFacility.persistentId,
        facility: selectedFacility,
        availableFacilities,
        acSelectFacility,
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
  return bindActionCreators({acInitialLoadFacilities, acSelectFacility, acToggleSidebar}, dispatch);
}

export default exposeRouter(connect(getState, mapDispatch)(FacilityWrapper));
