import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import exposeRouter from 'components/common/exposerouter';
import {RouteHandler} from 'react-router';

import {acInitialLoadFacilities, acSelectFacility} from './store';
import {getFacilityMutable} from "./get";


function mapDispatch(dispatch) {
  return bindActionCreators({acInitialLoadFacilities, acSelectFacility}, dispatch);
}

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
     const router = props.router;
     const facilityName = router.getCurrentParams().facilityName;
     this.props.acSelectFacility(facilityName);
  }

  renderLoading(a) {
    return <div>Selecting Facility...{(a)? a : ""}</div>;
  }

  render() {
    console.log("~~~~~ facility wraper");
    // if we are going directly to this route we must first load facilities
    if (this.props.loadingAvailableFacilities) return this.renderLoading();
    // if haven't selected facility render loading
    // after loading this component will refresh and in DidUpdate we will select correct facility
    const {selectedFacility, availableFacilities} = this.props;
    if (!selectedFacility) {
      return this.renderLoading(".");
    } else {
      return (
       <RouteHandler key={selectedFacility.persistentId}
                      facility={selectedFacility}
                      availableFacilities={availableFacilities}
                      acSelectFacility={this.props.acSelectFacility} />
      );
    }
  }
}

export default exposeRouter(connect(getFacilityMutable, mapDispatch)(FacilityWrapper));