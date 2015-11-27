import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import exposeRouter from 'components/common/exposerouter';
import {RouteHandler} from 'react-router';

import {acInitialLoadFacilities, acSelectFacility} from './store';

function mapState(state) {
  return state.facility;
}

function mapDispatch(dispatch) {
  return bindActionCreators({acInitialLoadFacilities, acSelectFacility}, dispatch);
}

class FacilityWraper extends Component {

  componentDidMount() {
    const {availableFacilities} = this.props;
    if (availableFacilities === null) {
      this.props.acInitialLoadFacilities();
    } else {
      this.selectFacilityFromRoute();
    }
  }

  componentDidUpdate() {
    this.selectFacilityFromRoute();
  }

  selectFacilityFromRoute() {
     const router = this.props.router;
     const facilityName = router.getCurrentParams().facilityName;
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
    const {selectedFacility} = this.props;
    if (!selectedFacility) return this.renderLoading(".");

    return (
      <RouteHandler key={selectedFacility.persistentId} facility={selectedFacility}/>
    );
  }
}

export default exposeRouter(connect(mapState, mapDispatch)(FacilityWraper));