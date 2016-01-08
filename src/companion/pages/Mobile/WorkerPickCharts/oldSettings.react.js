
/*
  renderSettings({filterOpen, filter, loadedTime, acOpenFilter, acCloseFilter,
      acSearch, acRefresh, acSetFilter, acSetFilterCloseAndRefresh}) {
    return (
      <Row>
        <Col xs={2}>
          <div className="thumbnail-wrapper d32 circular bg-primary text-white inline" onClick={filterOpen? acCloseFilter: acOpenFilter}>
              <Icon name={filterOpen? "chevron-up" : "chevron-down"}/>
          </div>
        </Col>
        <Col xs={8}>
          {(!filterOpen)
            ?<span>
              Count/{filter.interval.asMinutes()}m,  {filter.window.asHours()} hrs
               to <TimeFromNow time={filter.endtime}/>
            , Ref: 80/hr</span>
            :null
          }
          {filterOpen
          ? <div>
              <Button bsStyle="primary" bsSize="xs" onClick={() => acSetFilterCloseAndRefresh({
                interval: moment.duration(5, 'minutes'),
                window: moment.duration(2, 'hours'),
              })}>5 minutes - 2 hours</Button>
              <Button bsStyle="primary" bsSize="xs" onClick={() => acSetFilterCloseAndRefresh({
                interval: moment.duration(15, 'minutes'),
                window: moment.duration(4, 'hours'),
              })}>15 minutes - 4 hours</Button>
              <Button bsStyle="primary" bsSize="xs" onClick={() => acSetFilterCloseAndRefresh({
                interval: moment.duration(1, 'hours'),
                window: moment.duration(24, 'hours'),
              })}>1 hour - 24 hours</Button>
            </div>
          : null
          }
        </Col>
        <Col xs={2}>
          <Button bsStyle="primary" bsSize="xs" onClick={acRefresh}>Now</Button>
          {" "}
          <Button bsStyle="primary" bsSize="xs" onClick={() => acSearch(true)}><Icon name="refresh" /></Button>
        </Col>
      </Row>
    );
  }
*/