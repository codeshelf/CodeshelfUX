import React from 'react';
import DocumentTitle from 'react-document-title';
import {Grid, Row, Col} from 'react-bootstrap';
import {IBox, IBoxTitleBar, IBoxTitleText, IBoxSection} from 'components/common/IBox';

export default class NoLocation extends React.Component {

  componentDidMount() {
      console.log("mounted", this);

  }

  render() {
    // This is composite component. It load its data from store, and passes them
    // through props, so children  can leverage PureComponent.

    return (
                        <IBox>
                            <IBoxTitleBar>
                                <IBoxTitleText>
noloc
                                </IBoxTitleText>
                            </IBoxTitleBar>
                            <IBoxSection>
                            </IBoxSection>
                        </IBox>
    );
  }

};
