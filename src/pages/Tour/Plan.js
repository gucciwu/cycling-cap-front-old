import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, List, Skeleton, Avatar, Button, Icon } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { formatMessage, FormattedMessage } from 'umi/locale';
import BMap from 'BMap';
import BMapLib from 'BMapLib';
import styles from './style.less';


@connect(({ profile, loading }) => ({
  profile,
  loading: loading.effects['profile/fetchBasic'],
}))
class BasicProfile extends Component {
  state = {
    points: []
  };

  componentDidMount() {
    const map = new BMap.Map("map");
    map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);
    map.addControl(new BMap.MapTypeControl());
    map.setCurrentCity("北京");
    map.enableScrollWheelZoom(true);

    const drawingManager = new BMapLib.DrawingManager(map, {
      isOpen: true,
      drawingToolOptions: {
        offset: new BMap.Size(5, 5),
      },
    });
    drawingManager.addEventListener('overlaycomplete', this.overlayComplete);
  }

  overlayComplete = (e) => {
    console.log(e);
    this.appendPoint(e.overlay);
  };

  appendPoint = (point) => {
    const { points } = this.state;
    this.setState({
      points: points.concat(point)
    })
  };

  removePoint = (index) => {

  };

  clearPoints = () => {
    this.setState({
      points: [],
    });
  };

  getPointDescription = () => {

  };

  render() {
    const { loading } = this.props;
    const pointListRender = () => {
      const { points } = this.state;
      console.log(points);
      return (
        <List
          loading={loading}
          itemLayout="horizontal"
          dataSource={points}
          renderItem={item => (
            <List.Item actions={[<Icon type="delete" />]}>
              <List.Item.Meta
                title={`${item.point.lat}, ${item.point.lng}`}
                description={this.getPointDescription()}
              />
            </List.Item>
          )}
        />
      );
    };
    return (
      <PageHeaderWrapper title={<FormattedMessage id="app.tour.plan" defaultMessage="Plan" />} loading={loading}>
        <Row>
          <Col span={18}>
            <Card bordered={false}>
              <div id='map' style={{height:'600px'}} />
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false} style={{ marginLeft: 24 }}>
              { pointListRender() }
            </Card>
          </Col>
        </Row>

      </PageHeaderWrapper>
    );
  }
}

export default BasicProfile;
