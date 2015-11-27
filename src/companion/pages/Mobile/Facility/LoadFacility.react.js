import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import exposeRouter from 'components/common/exposerouter';

import {acInitialLoadFacilities} from './store';

function mapState(state) {
  return {...state.facility};
}

function mapDispatch(dispatch) {
  return bindActionCreators({acInitialLoadFacilities}, dispatch);
}

@connect(mapState, mapDispatch)
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
      router.transitionTo("mobile-search-orders", {facilityName: availableFacilities[0].persistentId});
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