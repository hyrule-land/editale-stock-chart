import G6 from '@antv/g6';
import config from './config';

G6.registerNode(
  'base-node',
  {
    options: {
      style: {
        fill: '#f9f9f9',
        stroke: '#bbb',
        cursor: 'default',
      },
      stateStyles: {
        selected: {
          fill: '#c6e5ff',
        },
      },
    },
    draw(cfg, group) {
      const { name, id, nodeType } = cfg;

      const rect = group.addShape('rect', {
        attrs: {
          x: 0,
          y: 0,
          radius: 15,
          lineWidth: 0.6,
          fontSize: 12,
          opacity: 1,
          isNodeShape: true,
          cursor: 'pointer',
          ...config.node[nodeType],
        },
      });

      group.addShape('text', {
        attrs: {
          textAlign: 'center',
          textBaseline: 'bottom',
          x: config.node[nodeType].width / 2,
          y: config.node[nodeType].height / 2 + 8,
          text: name.length > 10 ? `${name.substr(0, 10)}...` : name,
          fontSize: 14,
          cursor: 'pointer',
          isNodeShape: true,
          ...config.text[nodeType],
        },
      });

      // 添加左锚点
      group.addShape('circle', {
        attrs: {
          x: 0,
          y: config.node[nodeType].height / 2,
          r: 3,
          fill: config.node[nodeType].stroke,
        },
      });

      // 添加左锚点
      group.addShape('circle', {
        attrs: {
          x: config.node[nodeType].width,
          y: config.node[nodeType].height / 2,
          r: 3,
          fill: config.node[nodeType].stroke,
        },
      });

      // 显示 id 方便调试
      // group.addShape('text', {
      //   attrs: {
      //     textAlign: 'center',
      //     textBaseline: 'bottom',
      //     x: 85,
      //     y: -10,
      //     text: id,
      //     fontSize: 14,
      //     fill: '#000',
      //     cursor: 'pointer',
      //     isNodeShape: true,
      //   },
      // });

      return group;
    },
    update(cfg, item) {
      const { name } = cfg;
      const group = item.getContainer();
      const text = group.getChildByIndex(1);
      text.attr('text', name.length > 10 ? `${name.substr(0, 10)}...` : name);

      return group;
    },
    setState(name, value, item) {
      const group = item.getContainer();
      if (name === 'selected') {
        const rect = group.getChildByIndex(0);
        const text = group.getChildByIndex(1);

        if (value) {
          rect.attr('lineWidth', 3);
        } else {
          rect.attr('lineWidth', 0.6);
        }
      }
    },
    getAnchorPoints: function getAnchorPoints() {
      return [
        [0, 0.5],
        [1, 0.5],
      ];
    },
  },
  'single-shape',
);
