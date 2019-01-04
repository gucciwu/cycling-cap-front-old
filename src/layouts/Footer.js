import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import { generalSettings } from '../../config/settings';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[
        {
          key: 'company home page',
          title: '首页',
          href: generalSettings.website,
          blankTarget: true,
        },
        {
          key: 'github',
          title: <Icon type="github" />,
          href: generalSettings.website,
          blankTarget: true,
        },
        {
          key: 'company name',
          title: generalSettings.companyName,
          href: generalSettings.website,
          blankTarget: true,
        },
      ]}
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> {generalSettings.copyrightYear} {generalSettings.companyName}
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
