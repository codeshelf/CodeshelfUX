import React, {Component} from 'react';
import exposeRouter from 'components/common/exposerouter';

class DetectMobile extends Component {
  componentWillMount() {
    this.transition(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.transition(nextProps);
  }

  transition(props) {
    const {router} = props;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      router.push("/mobile/facilities");
    } else {
      router.push("/facilities");
    }
  }

  render() {
    return null;
  }
}

export default exposeRouter(DetectMobile);
