import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['td-game__board'],

  selectedTower: Ember.computed('attrs.selectedTower', function () {
    return this.attrs.selectedTower;
  }),

  selectedTowerGroup: Ember.computed('attrs.selectedTowerGroup', function () {
    return this.attrs.selectedTowerGroup;
  }),

  actions: {
    selectTower(tower) {
      // TODO THIS COMMIT: selecting tower must also select tower group
      if (this.attrs['select-tower']) {
        this.attrs['select-tower'](tower);
      }
    },

    selectTowerGroup(towerGroup) {
      if (this.attrs['select-tower-group']) {
        this.attrs['select-tower-group'](towerGroup);
      }
    }
  }
});
