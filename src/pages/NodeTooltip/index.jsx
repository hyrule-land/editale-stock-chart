import React from 'react';
import styles from './index.less';
const Index = props => {
  const { name = '', x = 0, y = 0 } = props;
  return (
    <div
      className={styles.nodeTooltip}
      style={{ bottom: `${y}px`, left: `${x}px` }}
    >
      <span>{name}</span>
    </div>
  );
};

export default Index;
