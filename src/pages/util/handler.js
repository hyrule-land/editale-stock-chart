export default {
  clearSelected() {
    let selected = this.findAllByState('node', 'selected');
    selected.forEach(node => {
      this.setItemState(node, 'selected', false);
    });
    selected = this.findAllByState('edge', 'selected');
    selected.forEach(edge => {
      this.setItemState(edge, 'selected', false);
    });
    // this._clearSubProcessSelected();
    this.set('selectedItems', []);
    this.emit('afteritemselected', []);
  },
  setItemSelected(id) {
    this.clearSelected();
    this.setItemState(id, 'selected', true);
    let selectedItems = this.get('selectedItems');
    if (!selectedItems) selectedItems = [];
    selectedItems = [id];
    this.set('selectedItems', selectedItems);
    this.emit('afteritemselected', selectedItems);
  },
};
