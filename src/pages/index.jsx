import React, { useState, useRef, useEffect } from 'react';
import G6 from '@antv/g6';
import styles from './index.less';

const initialData = {
  id: '9f7f4a3f-9590-427b-afcf-8eaf8494e06e',
  name:
    '招商银行股份有限公司招商银行股份有限公司招商银行股份有限公司招商银行股份有限公司',
  nodeType: 'root',
  nsrsbh: '9144030010001686XA',
};

let graph = null;

export default () => {
  const canvasRef = useRef(null);

  const [data, setData] = useState(initialData);

  // 绑定事件
  function bindEvents() {
    graph.on('node:mouseenter', function(evt) {
      const node = evt.item;
      const model = node.getModel();
      graph.setItemState(node, 'hover', true);
      graph.updateItem(node, {
        labelCfg: {
          style: {
            fill: '#003a8c',
          },
        },
      });
    });

    graph.on('node:mouseleave', function(evt) {
      const node = evt.item;
      const model = node.getModel();
      graph.setItemState(node, 'hover', false);
      graph.updateItem(node, {
        label: model.oriLabel,
        labelCfg: {
          style: {
            fill: '#555',
          },
        },
      });
    });
  }

  useEffect(() => {
    const canvasDom = canvasRef.current;
    debugger;

    const grid = new G6.Grid({
      //... configurations
    });

    graph = new G6.TreeGraph({
      container: canvasDom,
      // plugins: [ grid ],
      width: canvasDom.offsetWidth,
      height: canvasDom.offsetHeight,
      modes: {
        default: ['drag-canvas', 'zoom-canvas', 'click-select'],
        edit: ['click-select'],
      },
      defaultNode: {
        shape: 'rect',
      },
      defaultEdge: {
        shape: 'polyline',
      },
      nodeStateStyles: {
        hover: {
          lineWidth: 5,
          fillOpacity: 1,
        },
        active: {
          lineWidth: 5,
          fillOpacity: 1,
        },
      },
      edgeStateStyles: {
        hover: {
          lineWidth: 3,
        },
      },
      layout: {
        type: 'mindmap',
        direction: 'H',
        getHeight: () => 20,
        getWidth: () => 50,
        getVGap: () => 12,
        getHGap: d => {
          if (d.nodeType && d.nodeType === 'root') {
            return 180;
          }
          return 140;
        },
        getSide: d => {
          if (d.data.nodeType === 'gd-node') {
            return 'left';
          }
          return 'right';
        },
      },
    });

    graph.data(data);
    graph.render();
    graph.fitView(200);

    // 绑定事件
    bindEvents();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.studio}>
        <div className={styles.toolkit}>
          <span>撤销</span>
          <span>重做</span>
        </div>
        <div className={styles.chartCanvas} ref={canvasRef}></div>
      </div>
    </div>
  );
};
