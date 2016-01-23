import Ember from 'ember';
import createWave1 from 'tower-defense/utils/create-wave-1';
import createGame from 'tower-defense/utils/create-game';

export default Ember.Component.extend({
  classNames: ['td-game'],

  currentWave: createWave1(),

  game: createGame(),

  // gameWaves: Ember.ArrayProxy.create({ content: Ember.A([]) }),
  gameWaves: Ember.ArrayProxy.create({ content: Ember.A([]) }),

  selectedTower: null,

  selectedTowerGroup: null,

  twrStyles: null,

  twrGrpStyles: null,

  waveStarted: false,

  // thisWave: Ember.computed('gameWaves', function () {
  //   if (!!this.get('gameWaves')) {
  //     return this.get('gameWaves').get('firstObject');
  //   }
  // }),

  _startGame: Ember.observer('gameWaves', function () {
    this.get('game.waves').forEach((wave) => {
      this.get('gameWaves').pushObject(wave);
    });
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
