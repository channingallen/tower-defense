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
      debugger; // TODO THIS COMMIT: remove this
      if (this.get('selectedTowerGroup')) {
        this.forceSet('selectedTowerGroup', null);
      }

      this.forceSet('selectedTower', tower);
    },

    selectTowerGroup(towerGroup) {
      if (this.get('selectedTower')) {
        this.forceSet('selectedTower', null);
      }

      this.forceSet('selectedTowerGroup', towerGroup);
    },

    setStyles(twrGrpStyles, twrStyles) {
      if (this.get('selectedTowerGroup')) {
        this.set('selectedTowerGroup.styles', twrGrpStyles);
      }

      if (this.get('selectedTower')) {
        this.set('selectedTower.styles', twrStyles);
      }
    },

    startWave() {
      this.set('waveStarted', true);
    }
  }
});
