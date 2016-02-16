import  React from 'react';
import DocumentTitle from 'react-document-title';
import {Overlay, Popover, Button} from 'react-bootstrap';
import Icon from 'react-fa';
import _ from 'lodash';
import {Barcode} from "components/common/Barcode";
import {replenItem} from 'data/issues/actions';

class IssueButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null
    };
  }
  render() {
    let {rowData, style, onClick, iconName, title, className} = this.props;
    let {result} = this.state;
    let clickHandler = (e) =>{
        e.stopPropagation();
        _.partial(onClick, rowData).bind(this)().then((result) => {
          const value = result.scannableId;
          const component = (
            <div>
              <Barcode value={value} width={240} height={100} />
              {value}
            </div>
          );

          this.setState({result: {title: "Success", "message" : component }});
        }, (e) => {
          const message = e.body.errors.join("\n");
          this.setState({result: {title: "Error", "message": message}});
        });
    };
    return (
        <span>

          <Button className={className} bsStyle="primary" style={style} onClick={clickHandler} title={title}>
            <Icon name={iconName} />

          </Button>
          <Overlay
            show={(result != null)}
            placement="left"
            target={()=> React.findDOMNode(this)}
            rootClose={true}
            onHide={()=>{this.setState({result: null});}} >
              <Popover className={result && result.title.toLowerCase()} title={result && result.title}>{result && result.message}</Popover>
          </Overlay>
        </span>
    );
  }
}

export class IssueActions extends React.Component {


  render() {
    let {rowData} = this.props;
    const type = rowData.get("type");
    return (

        <div>
        {(type === "LOW" || type === "SHORT" || type === "SUBSTITUTION") &&
         <IssueButton className="replen" rowData={rowData} onClick={replenItem} iconName="retweet" title="Replenish"/> }
      </div>);
  }
}
