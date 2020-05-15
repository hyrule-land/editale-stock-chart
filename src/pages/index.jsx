import React, { useState, useRef, useEffect } from 'react';
import { Button, message } from 'antd';
import G6 from '@antv/g6';
import { useKeyPress } from '@umijs/hooks';
import styles from './index.less';
import initialData from './data';
import { isArrayAndNotEmpty } from './util/uilt';
import { v4 as uuidv4 } from 'uuid';
import TzfModal from './modal/index';

// shape
import './shape/node';
import './shape/edge';
import anchorPoints from './shape/anchorPoints';

// behavior
import './behavior/clickSelected';

// util

let graph = null;

const commands = ['enter', 'delete'];

export default () => {
  const canvasRef = useRef(null);

  const [data, setData] = useState(initialData);
  // 当前是否在 canvas 工作区内
  const [studioFocus, setStudioFocus] = useState(false);
  const [tzfModalVisible, setTzfModalVisible] = useState(false);
  const [tzfModalType, setTzfModalType] = useState('tzf');

  // 定义键盘事件
  useKeyPress(['enter', 'tab', 'delete'], event => {
    if (studioFocus && graph) {
      console.log(event);
      const { keyCode } = event;
      const selectedItems = graph.get('selectedItems');
      if (isArrayAndNotEmpty(selectedItems)) {
        // 新节点的 id
        const newNodeId = uuidv4();
        switch (keyCode) {
          case 9:
            // 这是还需要判断是否是 node
            const currentNodeData = graph.findDataById(selectedItems[0]);

            if (!currentNodeData.children) {
              currentNodeData.children = [];
            }
            currentNodeData.children.push({
              id: newNodeId,
              nodeType: 'gd-node',
              name: '招商**ddd**有限公司',
              anchorPoints,
              nsrsbh: '9144030010001686XA',
              parentId: selectedItems[0],
            });
            graph.changeData();
            graph.setItemSelected(newNodeId);
            break;
          case 13:
            const currentNode = graph.findById(selectedItems[0]);
            const currentNodeModel = currentNode.getModel();
            // 如果不是根节点
            if (currentNodeModel.id !== '0') {
              const parentNodeId = currentNodeModel.parentId;
              const parentNodeData = graph.findDataById(parentNodeId);
              parentNodeData.children.push({
                id: newNodeId,
                nodeType: 'gd-node',
                name: '招商**ddd**有限公司',
                anchorPoints,
                nsrsbh: '9144030010001686XA',
                parentId: parentNodeId,
              });
              graph.changeData();
              graph.setItemSelected(newNodeId);
            }
            break;
          case 46:
            alert('删除节点');
            break;
          default:
            alert('这是默认操作');
        }
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
      plugins: [grid],
      width: canvasDom.offsetWidth,
      height: canvasDom.offsetHeight,
      modes: {
        default: [
          'drag-canvas',
          'zoom-canvas',
          'clickSelected',
          // 'activate-relations',
          // 'brush-select',
          // {
          //   type: 'drag-node',
          //   enableDelegate: true,
          // },
        ],
        edit: ['click-select'],
      },
      defaultNode: {
        type: 'base-node',
      },
      defaultEdge: {
        type: 'polyline',
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
        // getSide: d => {
        //   if (d.data.nodeType === 'gd-node') {
        //     return 'left';
        //   }
        //   return 'right';
        // },
      },
    });

    // 设置实例方法 清楚选中的节点或边
    graph.clearSelected = () => {
      let selected = graph.findAllByState('node', 'selected');
      selected.forEach(node => {
        graph.setItemState(node, 'selected', false);
      });
      selected = graph.findAllByState('edge', 'selected');
      selected.forEach(edge => {
        graph.setItemState(edge, 'selected', false);
      });
      // graph._clearSubProcessSelected();
      graph.set('selectedItems', []);
      graph.emit('afteritemselected', []);
    };

    // 设置选中某个节点或边
    graph.setItemSelected = id => {
      graph.clearSelected();
      graph.setItemState(id, 'selected', true);
      let selectedItems = graph.get('selectedItems');
      if (!selectedItems) selectedItems = [];
      selectedItems = [id];
      graph.set('selectedItems', selectedItems);
      graph.emit('afteritemselected', selectedItems);
    };

    // 获取选中的节点
    // graph.getSelectedNodes = () => {
    //   return graph.findAllByState('node', 'selected');
    // }
    //
    // // 获取选中的边
    // graph.getSelectedEdges = () => {
    //   return graph.findAllByState('edge', 'selected');
    // }

    graph.data(initialData);
    graph.render();
    graph.fitView(200);
    graph.zoomTo(1);
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

  function addChildNode(data) {
    console.log(data);
    const selectedItems = graph.get('selectedItems');
    if (isArrayAndNotEmpty(selectedItems)) {
      // 新节点的 id
      const newNodeId = uuidv4();
      const currentNodeData = graph.findDataById(selectedItems[0]);

      if (!currentNodeData.children) {
        currentNodeData.children = [];
      }
      currentNodeData.children.push({
        id: newNodeId,
        anchorPoints,
        parentId: selectedItems[0],
        ...data,
      });
      graph.changeData();
      graph.setItemSelected(newNodeId);
    }
  }

  function onModalOk(data) {
    const selectedItems = graph.get('selectedItems');
    addChildNode(data);
    setTzfModalVisible(false);
  }

  function onCancel() {
    setTzfModalVisible(false);
  }

  function openModal(type) {
    const selectedItems = graph.get('selectedItems');
    if (isArrayAndNotEmpty(selectedItems)) {
      setTzfModalType(type);
      setTzfModalVisible(true);
    } else {
      message.error('未选中节点');
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

          <Button onClick={() => openModal('tzf')}>添加投资方</Button>
          <Button onClick={() => openModal('dwtzf')}>添加对外投资方</Button>
        </div>
        <div className={styles.chartCanvas} ref={canvasRef} id="chartCanvas" />
      </div>

      <TzfModal
        visible={tzfModalVisible}
        onOk={onModalOk}
        onCancel={onCancel}
        type={tzfModalType}
      />
    </div>
  );
};
