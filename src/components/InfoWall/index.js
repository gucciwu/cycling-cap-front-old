import React from 'react';
import classNames from 'classnames';
import { Icon } from 'antd';
import styles from './index.less';

export default function InfoWall({
  className, type, title, description, extra, actions, ...restProps
}) {
  const iconMap = {
    error: <Icon className={styles.error} type="close-circle" />,
    success: <Icon className={styles.success} type="check-circle" />,
    loading: <Icon className={styles.loading} type="loading" />,
    exclamation: <Icon className={styles.warning} type="exclamation-circle" />,
  };
  const clsString = classNames(styles.result, className);
  return (
    <div className={clsString} {...restProps} style={{marginTop: 48, marginBottom: 16}}>
      <div className={styles.icon}>{iconMap[type]}</div>
      <div className={styles.title}>{title}</div>
      {description && <div className={styles.description}>{description}</div>}
      {extra && <div className={styles.extra}>{extra}</div>}
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
}
