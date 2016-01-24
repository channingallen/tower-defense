import Ember from 'ember';
import createGame from 'tower-defense/utils/create-game';

export default Ember.Component.extend({
  classNames: ['td-game'],

  currentWave: null,

  game: createGame(),

  selectedTower: null,

  selectedTowerGroup: null,

  twrStyles: null,

  twrGrpStyles: null,

  waveStarted: false,

  // TODO THIS COMMIT: Ember arrays cannot be accessed via get.('num')
  _setWave(waveNumber) {
    const waves = this.get('game').get('waves');

    if (!!waves.get(waveNumber)) {
      this.set('currentWave', waves.get(waveNumber));
    }
  },

  _startGame: Ember.on('didInsertElement', function () {
    if (!!this.get('game')) {
      this._setWave('firstObject');
    }
  }),

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
