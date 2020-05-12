import G6 from '@antv/g6';

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
      const { name } = cfg;
      let rectConfig = {
        width: 180,
        height: 30,
        radius: 15,
        stroke: '#000',
        fill: '#fff',
        lineWidth: 0.6,
        fontSize: 12,
        opacity: 1,
        isNodeShape: true,
        cursor: 'pointer',
      };

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
        fill: '#000',
        cursor: 'pointer',
        isNodeShape: true,
      };

      group.addShape('text', {
        attrs: {
          ...textConfig,
        },
      });

      return rect;
    },
    setState(name, value, item) {
      const group = item.getContainer();
      if (name === 'selected') {
        const rect = group.getChildByIndex(0);
        const text = group.getChildByIndex(1);

        if (value) {
          rect.attr('fill', this.options.stateStyles.selected.fill);
        } else {
          rect.attr('fill', this.options.style.fill);
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
