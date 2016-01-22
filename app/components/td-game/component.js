import Ember from 'ember';
import createWave from 'tower-defense/utils/create-wave';

export default Ember.Component.extend({
  classNames: ['td-game'],

  currentWave: createWave(),

  selectedTower: null,

  selectedTowerGroup: null,

  twrStyles: null,

  twrGrpStyles: null,

  waveStarted: false,

  actions: {
    selectTower(tower) {
      if (this.get('waveStarted')) {
        return;
      }

      if (this.get('selectedTowerGroup')) {
        this.forceSet('selectedTowerGroup', null);
      }

      this.forceSet('selectedTower', tower);
    },

    selectTowerGroup(towerGroup) {
      if (this.get('waveStarted')) {
        return;
      }

      if (this.get('selectedTower')) {
        this.forceSet('selectedTower', null);
      }

      this.forceSet('selectedTowerGroup', towerGroup);
    },

    setStyles(blockCodeLines) {
      if (this.get('selectedTowerGroup')) {
        this.set('selectedTowerGroup.styles', blockCodeLines);
      }

      if (this.get('selectedTower')) {
        this.set('selectedTower.styles', blockCodeLines);
      }
    },

    startWave() {
      this.set('waveStarted', true);
    }
  }
});
