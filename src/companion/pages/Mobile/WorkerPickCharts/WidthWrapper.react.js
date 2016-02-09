import {Component} from 'react';

export class WidthWrapper extends Component {
  constructor() {
    super();
    this.state = {
      width: null,
    }
    this.onResize = this.onResize.bind(this);
  }

  componentDidMount() {
    this.onResize();
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize() {
    //TODO react 0.14+ remove getDOMNode() from chain ref will contain DOM element
    this.setState({width: this.el.offsetWidth});
  }

  render() {
    if (this.state.width === null) {
      return (
        <div ref={(el) => this.el = el}>
          <div style={{width: "1px", height: "1px"}} />
        </div>
      );
    } else {
      return (
        <div ref={(el) => this.el = el}>
          {this.props.children(this.state.width)}
        </div>
      );
    }
  }
}
