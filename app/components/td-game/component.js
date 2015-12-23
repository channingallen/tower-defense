import Ember from 'ember';
import createWave from 'tower-defense/utils/create-wave';

export default Ember.Component.extend({
  classNames: ['td-game'],

  currentWave: createWave(),

  selectedTower: null,

  selectedTowerGroup: null,

  waveStarted: false,

  actions: {
    selectTower(tower) {
      this.set('selectedTower', tower);
    },

    selectTowerGroup(towerGroup) {
      this.set('selectedTowerGroup', towerGroup);
    },

    startWave() {
      this.set('waveStarted', true);
    }
  }
});
