import React from 'react';
import styles from './index.less';

function BaseLayout(props) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>可编辑的股权架构图</div>
      <div className={styles.content}>{props.children}</div>
    </div>
  );
}

export default BaseLayout;
