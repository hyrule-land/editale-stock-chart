import React, { useState, useRef, useEffect } from 'react';
import { Button, message } from 'antd';
import G6 from '@antv/g6';
import { useKeyPress } from '@umijs/hooks';
import styles from './index.less';
import initialData from './data';
import { isArrayAndNotEmpty } from './util/uilt';
import { v4 as uuidv4 } from 'uuid';
import TzfModal from './modal/index';

import _findLastIndex from 'lodash/findLastIndex';
import _isEmpty from 'lodash/isEmpty';

// shape
import './shape/node';
import './shape/edge';
import anchorPoints from './shape/anchorPoints';

// behavior
import './behavior/clickSelected';

// custom component
import NodeTooltip from './components/NodeTooltip';

// util

let graph = null;

const commands = ['enter', 'delete'];

export default () => {
  const canvasRef = useRef(null);
  const studioRef = useRef(null);

  const [data, setData] = useState(initialData);
  // 当前是否在 canvas 工作区内
  const [studioFocus, setStudioFocus] = useState(false);
  const [tzfModalVisible, setTzfModalVisible] = useState(false);
  const [tzfModalType, setTzfModalType] = useState('tzf');

  // 节点的 tooltip
  const [showNodeTooltip, setShowNodeTooltip] = useState(false);
  const [nodeTooltipText, setNodeTooltipText] = useState('');
  const [nodeTooltipX, setNodeToolTipX] = useState(0);
  // 这个其实是是在 css 的 bottom，所以命名上其实是不太对的，懒得改了
  const [nodeTooltipY, setNodeToolTipY] = useState(0);

  // 新增节点跟当前节点的关系 兄弟：brother，子节点：child
  const [newNodeRelation, setNewNodeRelation] = useState('child');

  //
  const [modalDataSource, setModalDataSource] = useState({});

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
            setNewNodeRelation('child');
            openModal('tzf');
            break;
          case 13:
            const currentNodeData = graph.findDataById(selectedItems[0]);

            // 如果当前选中的节点不是根节点，才可以进行操作
            if (currentNodeData.id === '0' || currentNodeData.id === 0) {
              message.warning('根节点不允许添加同级节点');
            } else {
              setNewNodeRelation('brother');
              openModal('tzf');
            }
            break;
          case 46:
            removeNode();
            break;
          default:
            message.info('这是默认操作');
        }
      }
    }
  });

  // 绑定事件
  function bindEvents() {
    graph.on('node:mouseenter', evt => {
      const { item } = evt;
      const model = item.getModel();
      const { x, y, name, tyshxydm, nodeType, location } = model;
      const point = graph.getCanvasByPoint(x, y);

      const tooltipDom = (
        <div>
          {/*<div>节点类型: {nodeType}</div>*/}
          <div>名称: {name}</div>
          <div>统一社会信用代码: {tyshxydm}</div>
          <div>国家(地区): {location}</div>
        </div>
      );

      setNodeTooltipText(tooltipDom);
      setNodeToolTipX(point.x);
      // 这个其实是是在 css 的 bottom，所以命名上其实是不太对的，懒得改了
      setNodeToolTipY(studioRef.current.offsetHeight - point.y - 40);
      setShowNodeTooltip(true);
    });

    graph.on('node:mouseleave', evt => {
      setShowNodeTooltip(false);
    });

    graph.on('node:dblclick', evt => {
      const { item } = evt;
      const model = item.getModel();
      debugger;
      if (model.id === 0 || model.id === '0') {
        message.warning('当前企业不允许修改');
      } else {
        const { nodeType } = model;
        setModalDataSource({
          ...model,
          action: 'update',
        });
        setTzfModalType(nodeType);
        setTzfModalVisible(true);
      }
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
        // type: 'dendrogram',
        direction: 'H',
        getHeight: () => 20,
        getWidth: () => 50,
        getVGap: () => 12,
        getHGap: d => {
          if (d.nodeType && d.nodeType === 'root') {
            return 200;
          }
          return 160;
        },
        getSide: d => {
          // if (d.data.nodeType === 'gd-node') {
          //   return 'left';
          // }
          return 'right';
        },
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

  function addNode(data) {
    debugger;
    console.log(data);
    const selectedItems = graph.get('selectedItems');
    if (isArrayAndNotEmpty(selectedItems)) {
      // 新节点的 id
      const newNodeId = uuidv4();

      let targetNodeData = graph.findDataById(selectedItems[0]);
      let parentId = selectedItems[0];

      // 当添加的是兄弟节点的时候，那么需要判断当前选中的不是根节点
      if (newNodeRelation === 'brother') {
        parentId = targetNodeData.parentId;
        targetNodeData = graph.findDataById(targetNodeData.parentId);
        // 如果当前选中的节点是 “根节点”
        if (parentId === '-1' || parentId === -1) {
          return;
        }
      }

      if (!targetNodeData.children) {
        targetNodeData.children = [];
      }
      // 如果子节点数组长度为空，或者节点类型是'对外投资方'，则添加在后面
      if (targetNodeData.children.length === 0 || data.nodeType === 'dwtzf') {
        targetNodeData.children.push({
          ...data,
          id: newNodeId,
          anchorPoints,
          parentId,
        });
      } else {
        // 找到最后一个 “投资方” 的节点
        const lastTzfNodeIndex = _findLastIndex(
          targetNodeData.children,
          item => {
            return item.nodeType === 'tzf';
          },
        );

        targetNodeData.children = targetNodeData.children
          .slice(0, lastTzfNodeIndex + 1)
          .concat({
            ...data,
            id: newNodeId,
            anchorPoints,
            parentId,
          })
          .concat(
            targetNodeData.children.slice(
              lastTzfNodeIndex + 1,
              targetNodeData.children.length,
            ),
          );
      }

      graph.changeData();
      graph.setItemSelected(newNodeId);
    }
  }

  function updateNode(data) {
    debugger;
    // const { id } = data;
    // let targetNodeData = graph.findDataById(id);
    // targetNodeData = {
    //   ...targetNodeData,
    //   ...data
    // }
    // graph.changeData();

    const { id } = data;
    let item = graph.findById(id);
    const model = item.getModel();
    debugger;
    item.update({
      ...model,
      ...data,
    });
    item.refresh();

    graph.refresh();
    graph.paint();
    graph.changeData();
  }

  function onModalOk(data) {
    console.log(data);
    const selectedItems = graph.get('selectedItems');
    const { id } = data;
    debugger;
    // 新增节点
    if (_isEmpty(id)) {
      addNode(data);
    } else {
      // 更新节点
      updateNode(data);
    }
    setTzfModalVisible(false);
  }

  function onCancel() {
    setTzfModalVisible(false);
  }

  // 新增节点的 弹窗
  function openModal(type) {
    const selectedItems = graph.get('selectedItems');
    if (isArrayAndNotEmpty(selectedItems)) {
      setModalDataSource({});
      setTzfModalType(type);
      setTzfModalVisible(true);
    } else {
      message.error('未选中节点');
    }
  }

  function removeNode() {
    const selectedItems = graph.get('selectedItems');
    const selectedNodeId = selectedItems[0];
    let targetNodeId = -999;
    if (isArrayAndNotEmpty(selectedItems)) {
      const targetNode = graph.findById(selectedNodeId);

      targetNode.getEdges().forEach(edge => {
        if (edge.getTarget().getModel().id === selectedNodeId) {
          targetNodeId = edge.getPrePoint().id;
          return;
        }
      });

      if (targetNodeId !== -999) {
        const targetNodeData = graph.findDataById(targetNodeId);
        if (!targetNodeData.children) {
          targetNodeData.children = [];
        }
        targetNodeData.children = targetNodeData.children.filter(item => {
          return item.id !== selectedItems[0];
        });
        graph.changeData();
        graph.clearSelected();
      }
    } else {
      message.error('未选中节点');
    }
  }

  function save() {
    if (graph) {
      const outputData = graph.save();
      debugger;
    }
  }

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.studio}
        onMouseEnter={onStudioMouseEnter}
        onMouseLeave={onStudioMouseLeave}
        ref={studioRef}
      >
        <div className={styles.toolbar}>
          {/*<Button>撤销</Button>
          <Button>重做</Button>
          <Button onClick={() => onModeChange('default')}>查看模式</Button>
          <Button onClick={() => onModeChange('edit')}>编辑模式</Button>*/}

          <Button onClick={() => openModal('tzf')}>添加投资方</Button>
          <Button onClick={() => openModal('dwtzf')}>添加对外投资方</Button>

          <Button onClick={removeNode}>删除</Button>
          <Button onClick={save}>保存</Button>
        </div>
        <div className={styles.chartCanvas} ref={canvasRef} id="chartCanvas" />

        {showNodeTooltip && (
          <NodeTooltip
            name={nodeTooltipText}
            x={nodeTooltipX}
            y={nodeTooltipY}
          />
        )}
      </div>

      <TzfModal
        visible={tzfModalVisible}
        onOk={onModalOk}
        onCancel={onCancel}
        type={tzfModalType}
        dataSource={modalDataSource}
      />
    </div>
  );
};
