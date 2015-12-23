import Ember from 'ember';
import createWave from 'tower-defense/utils/create-wave';

export default Ember.Component.extend({
  classNames: ['td-game'],

  currentWave: createWave(),

  selectedTowerGroup: null,

  waveStarted: false,

  actions: {
    // TODO THIS COMMIT: add selectTower action

    selectTowerGroup(towerGroup) {
      this.set('selectedTowerGroup', towerGroup);
    },

    startWave() {
      this.set('waveStarted', true);
    }
  }
});
