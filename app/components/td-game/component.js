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
      this.set('selectedTowerGroup', null);
    },

    selectTowerGroup(towerGroup) {
      this.set('selectedTowerGroup', towerGroup);
      this.set('selectedTower', null);
    },

    startWave() {
      this.set('waveStarted', true);
    }
  }
});
