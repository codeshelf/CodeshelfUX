import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import exposeRouter from 'components/common/exposerouter';

import {acInitialLoadFacilities} from './store';
import {getFacilityMutable} from "./get";
import URI from 'urijs';

function mapDispatch(dispatch) {
  return bindActionCreators({acInitialLoadFacilities}, dispatch);
}

class LoadContext extends Component {

  componentDidMount() {
    this.loadAndRedirect();
  }

  componentDidUpdate() {
    this.loadAndRedirect();
  }


  loadAndRedirect() {
    const {availableFacilities} = this.props;
    if (!availableFacilities) {
      this.props.acInitialLoadFacilities();
    } else if (availableFacilities.length === 0) {
      console.log("No facilities");
    } else {
      const {router, location} = this.props;
      const newUri = new URI(`./facilities/${availableFacilities[0].domainId}/customers/ALL`);
      const newURL = newUri.absoluteTo(location.pathname+location.search).toString();
      router.push(newURL);
    }
  }

  render() {
    const {availableFacilities} = this.props;
    let message = "";
    if (!availableFacilities) {
      message = "Finding Facilities...";
    } else if (availableFacilities.length === 0) {
      message = "No Facilities";
    } else {
      message = "Loading Facility...";
    }
    return (
      <div>
        {message}
      </div>
    );
  }
}

export default exposeRouter(connect(getFacilityMutable, mapDispatch)(LoadContext));
