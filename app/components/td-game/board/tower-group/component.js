import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['board__tower-group'],

  classNameBindings: ['currentTowerGroupSelected:board__tower-group--selected'],

  currentTowerGroupSelected: Ember.computed(
    'attrs.selectedTowerGroup',
    'attrs.towerGroup',
    function () {
      return this.attrs.selectedTowerGroup === this.attrs.towerGroup ?
             true :
             false;
     }
  ),

  actions: {
    selectTower(tower) {
      if (this.attrs['select-tower']) {
        this.attrs['select-tower'](tower);
      }
    }
  }
});
