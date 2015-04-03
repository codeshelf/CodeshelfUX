import React from 'react';
import {RouteHandler} from 'react-router';
import DocumentTitle from 'react-document-title';
import {Grid, Row, Col} from 'react-bootstrap';
import {IBox, IBoxTitleBar, IBoxTitleText, IBoxSection} from 'components/common/IBox';
import BlockedWorkSummary from './BlockedWorkSummary';
import {blockedWorkCursor} from 'data/state';

export default class BlockedWork extends React.Component {

  componentDidMount() {
      console.log("mounted", this);

  }

  render() {
    // This is composite component. It load its data from store, and passes them
    // through props, so children  can leverage PureComponent.
    const blockedWork = blockedWorkCursor();

    return (
      <DocumentTitle title="Blocked Work">
            <Grid className="wrapper wrapper-content">
                <Row>
                    <Col xs={6} md={4}>
                        <IBox>
                            <IBoxTitleBar>
                                <IBoxTitleText>
                                    Blocked Work
                                </IBoxTitleText>
                            </IBoxTitleBar>
                            <IBoxSection>
                                <BlockedWorkSummary summaries={blockedWork.get('summaries')} />
                            </IBoxSection>
                        </IBox>
                    </Col>
                </Row>
                <Row>
                    <Col xs={6} md={8}>
                        <RouteHandler />
                    </Col>
                </Row>
            </Grid>
      </DocumentTitle>
    );
  }

};
