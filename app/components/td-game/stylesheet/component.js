import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['sidebar__stylesheet'],

  selectedTowerGroup: Ember.computed('attrs.selectedTowerGroup', function () {
    return this.attrs.selectedTowerGroup;
  }),

  actions: {
    selectTowerGroup(towerGroup) {
      if (this.attrs['select-tower-group']) {
        this.attrs['select-tower-group'](towerGroup);
      }
    }
  }
});
