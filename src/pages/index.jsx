import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'antd';
import G6 from '@antv/g6';
import { useKeyPress } from '@umijs/hooks';
import styles from './index.less';
import initialData from './data';
import { isArrayAndNotEmpty } from './util/uilt';

// shape
import './shape/node';

// behavior
import './behavior/clickSelected';

let graph = null;

const commands = ['enter', 'delete'];

const anchorPoints = [
  [0, 0.5],
  [1, 0.5],
];

export default () => {
  const canvasRef = useRef(null);

  const [data, setData] = useState(initialData);
  // 当前是否在 canvas 工作区内
  const [studioFocus, setStudioFocus] = useState(false);

  // 按下 enter 键盘
  useKeyPress(['enter'], event => {
    debugger;
    if (studioFocus && graph) {
      console.log(event);

      const selectedItems = graph.get('selectedItems');
      if (isArrayAndNotEmpty(selectedItems)) {
        const currentNode = graph.findById(selectedItems[0]);
        currentNode.children = [
          {
            id: '3308bab7-6366-4674-a3ab-1949a6481e04',
            nodeType: 'gd-node',
            name: '招商****有限公司',
            anchorPoints: [
              [0, 0.5],
              [1, 0.5],
            ],
            parentNsrsbh: '440300279343712',
            data: {
              nsrsbh: '440300279343712',
              nsrmc: '深圳市招****控股有限公司',
              djxh: '10114403000025577472',
              tzfhhhrmc: '招商****有限公司',
              tzbl: 0.9,
              lrrq: '2018-05-28T03:23:45.000+0000',
              hasChild: false,
              gdSfsz: false,
              btzfSfsz: true,
              isCrossBorderConnectedTransaction: false,
            },
            tzbl: 0.9,
            hasChild: false,
            isCrossBorderConnectedTransaction: false,
            isSz: false,
          },
          {
            id: '2ea29a2e-af21-45b4-9772-03a8291ab2be',
            nodeType: 'gd-node',
            name: '招商局****份有限公司',
            anchorPoints: [
              [0, 0.5],
              [1, 0.5],
            ],
            parentNsrsbh: '440300279343712',
            data: {
              nsrsbh: '440300279343712',
              nsrmc: '深圳市招****股有限公司',
              djxh: '10114403000025577472',
              tzfhhhrmc: '招商局****份有限公司',
              tzbl: 0.1,
              lrrq: '2018-05-28T03:23:45.000+0000',
              hasChild: false,
              gdSfsz: false,
              btzfSfsz: true,
              isCrossBorderConnectedTransaction: false,
            },
            tzbl: 0.1,
            hasChild: false,
            isCrossBorderConnectedTransaction: false,
            isSz: false,
          },
          {
            id: '7b6f4e6e-e9c8-46f5-8cf0-370dad7a9760',
            nodeType: 'tz-node',
            name: '深圳市****资发展有限公司',
            nsrsbh: '440300733041985',
            anchorPoints: [
              [0, 0.5],
              [1, 0.5],
            ],
            parentNsrsbh: '440300279343712',
            data: {
              nsrsbh: '440300733041985',
              nsrmc: '深圳市****资发展有限公司',
              djxh: '10114403000026261504',
              tzfhhhrmc: '深圳****资控股有限公司',
              tzfhhrdjxh1: '10114403000025577000',
              tzfhhrnsrsbh1: '440300279343712',
              tzbl: 0.51,
              lrrq: '2011-12-05T09:15:54.000+0000',
              hasChild: true,
              gdSfsz: true,
              btzfSfsz: true,
              gdSx: '企业',
              isCrossBorderConnectedTransaction: true,
            },
            tzbl: 0.51,
            hasChild: true,
            isCrossBorderConnectedTransaction: true,
            isSz: true,
          },
          {
            id: 'a398b69e-362b-4a8a-b3b8-d0fb92214559',
            nodeType: 'tz-node',
            name: '深圳市楚****展有限公司',
            nsrsbh: '440300733079158',
            anchorPoints: [
              [0, 0.5],
              [1, 0.5],
            ],
            parentNsrsbh: '440300279343712',
            data: {
              nsrsbh: '440300733079158',
              nsrmc: '深圳市楚****展有限公司',
              djxh: '10114403000025610240',
              tzfhhhrmc: '深圳市****资控股有限公司',
              tzfhhrdjxh1: '10114403000025577000',
              tzfhhrnsrsbh1: '440300279343712',
              tzbl: 0.5,
              lrrq: '2011-12-04T16:00:00.000+0000',
              hasChild: true,
              gdSfsz: true,
              btzfSfsz: true,
              gdSx: '企业',
              isCrossBorderConnectedTransaction: true,
            },
            tzbl: 0.5,
            hasChild: true,
            isCrossBorderConnectedTransaction: true,
            isSz: true,
          },
        ];
        graph.changeData();
      }
    }
  });

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

    const grid = new G6.Grid({
      //... configurations
    });

    graph = new G6.TreeGraph({
      container: canvasDom,
      // plugins: [ grid ],
      width: canvasDom.offsetWidth,
      height: canvasDom.offsetHeight,
      modes: {
        default: [
          'drag-canvas',
          'zoom-canvas',
          'clickSelected',
          // 'activate-relations',
          // 'brush-select',
          {
            type: 'drag-node',
            enableDelegate: true,
          },
        ],
        edit: ['click-select'],
      },
      defaultNode: {
        shape: 'base-node',
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
    graph.setMode('default');

    // 绑定事件
    bindEvents();
  }, []);

  function onStudioMouseEnter() {
    setStudioFocus(true);
  }

  function onStudioMouseLeave() {
    setStudioFocus(false);
  }

  function onModeChange(mode) {
    if (graph) {
      graph.setMode(mode);
    }
  }

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.studio}
        onMouseEnter={onStudioMouseEnter}
        onMouseLeave={onStudioMouseLeave}
      >
        <div className={styles.toolbar}>
          <Button>撤销</Button>
          <Button>重做</Button>
          <Button onClick={() => onModeChange('default')}>查看模式</Button>
          <Button onClick={() => onModeChange('edit')}>编辑模式</Button>
        </div>
        <div className={styles.chartCanvas} ref={canvasRef} id="chartCanvas" />
      </div>
    </div>
  );
};
