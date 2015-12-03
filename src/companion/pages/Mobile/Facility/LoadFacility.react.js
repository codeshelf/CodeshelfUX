import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import exposeRouter from 'components/common/exposerouter';

import {acInitialLoadFacilities} from './store';
import {getFacility} from "./get";

function mapDispatch(dispatch) {
  return bindActionCreators({acInitialLoadFacilities}, dispatch);
}

@connect(getFacility, mapDispatch)
class LoadFacility extends Component {

  componentDidMount() {
    this.loadAndRedirect();
  }

  componentDidUpdate() {
    this.loadAndRedirect();
  }


  loadAndRedirect() {
    const {availableFacilities} = this.props;
    if (!availableFacilities || availableFacilities.length === 0) {
      this.props.acInitialLoadFacilities()
    } else {
      const router = this.props.router;
      router.transitionTo("mobile-search-orders", {facilityName: availableFacilities[0].domainId});
    }
  }

  render() {
    return (
      <div>
        Loading Facility...
      </div>
    );
  }
}

export default exposeRouter(LoadFacility);