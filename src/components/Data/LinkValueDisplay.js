import React from 'react';
import Iceberg from './Iceberg';

export default class LinkValueDisplay extends React.PureComponent {
  render () {
    return <Iceberg {...this.props} topRender={value=>value} />
  }
}
