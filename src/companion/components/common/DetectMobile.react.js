import React, {Component} from 'react';
import exposeRouter from 'components/common/exposerouter';

class DetectMobile extends Component {

  render() {
    const {router} = this.props;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      router.transitionTo("mobile");
    } else {
      router.transitionTo("facilities");
    }
    return null;
  }
}

export default exposeRouter(DetectMobile);