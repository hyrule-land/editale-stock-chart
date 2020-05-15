import React from 'react';
import styles from './NodeTooltip.less';
const NodeToolTip = props => {
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

export default NodeToolTip;
