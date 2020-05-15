import G6 from '@antv/g6';
import colorConfig from './color';

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
      let rectConfig = {
        width: 180,
        height: 30,
        radius: 15,
        stroke: colorConfig[nodeType].stroke,
        fill: colorConfig[nodeType].fill,
        lineWidth: 0.6,
        fontSize: 12,
        opacity: 1,
        isNodeShape: true,
        cursor: 'pointer',
      };

      // 当节点为根节点的时候
      if (nodeType === 'root') {
        rectConfig = {
          ...rectConfig,
          width: 250,
          height: 50,
        };
      }

      const rect = group.addShape('rect', {
        attrs: {
          x: 0,
          y: 0,
          ...rectConfig,
        },
      });

      let textConfig = {
        textAlign: 'center',
        textBaseline: 'bottom',
        x: 85,
        y: 24,
        text: name.length > 10 ? `${name.substr(0, 10)}...` : name,
        fontSize: 14,
        fill: colorConfig[nodeType].textColor,
        cursor: 'pointer',
        isNodeShape: true,
      };

      group.addShape('text', {
        attrs: {
          ...textConfig,
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

      return rect;
    },
    setState(name, value, item) {
      const group = item.getContainer();
      if (name === 'selected') {
        const rect = group.getChildByIndex(0);
        const text = group.getChildByIndex(1);

        // if (value) {
        //   rect.attr('fill', this.options.stateStyles.selected.fill);
        // } else {
        //   rect.attr('fill', this.options.style.fill);
        // }

        if (value) {
          rect.attr('lineWidth', 3);
        } else {
          rect.attr('lineWidth', 0.6);
        }
      }
    },
    getAnchorPoints() {
      return [
        [0.5, 0], // top
        [1, 0.5], // right
        [0.5, 1], // bottom
        [0, 0.5], // left
      ];
    },
  },
  'single-shape',
);
