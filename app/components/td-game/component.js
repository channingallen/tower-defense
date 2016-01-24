import Ember from 'ember';
import createGame from 'tower-defense/utils/create-game';

export default Ember.Component.extend({
  classNames: ['td-game'],

  currentWaveNumber: null,

  game: createGame(),

  selectedTower: null,

  selectedTowerGroup: null,

  twrStyles: null,

  twrGrpStyles: null,

  waveStarted: false,

  currentWave: Ember.computed('currentWaveNumber', function () {
    let activeWave;
    this.get('game.waves').forEach((wave) => {
      if (wave.get('number') === this.get('currentWaveNumber')) {
        activeWave = wave;
      }
    });

    return activeWave;
  }),

  _setWave(targetWaveNumber) {
    const waves = this.get('game').get('waves');

    if (waves.get('length')) {
      waves.forEach((wave) => {
        if (wave.get('number') === targetWaveNumber) {
          this.set('currentWaveNumber', wave.get('number'));
        }
      });
    }
  },

  _startGame: Ember.on('didInsertElement', function () {
    if (!!this.get('game')) {
      this._setWave(1);
    }
  }),

  actions: {
    changeWaveNext() {
      if (this.get('waveStarted')) {
        console.error('You cannot start a new wave until this wave ends.');

        return;
      }

      const currentWaveNum = this.get('currentWaveNumber');
      if (currentWaveNum < this.get('game.waves.length')) {
        this.incrementProperty('currentWaveNumber');
      }
    },

    changeWavePrevious() {
      if (this.get('waveStarted')) {
        console.error('You cannot start a new wave until this wave ends.');

        return;
      }

      const currentWaveNum = this.get('currentWaveNumber');
      if (currentWaveNum > 1) {
        this.decrementProperty('currentWaveNumber');
      }
    },

    // TODO THIS COMMIT: this is never currently called
    changeWaveSelect(waveNum) {
      if (this.get('waveStarted')) {
        console.error('You cannot start a new wave until this wave ends.');

        return;
      }

      this.set('currentWaveNumber', waveNum);
    },

    scoreWave(wavePoints) {
      if (wavePoints >= this.get('currentWave.minimumScore')) {
        console.log('Congratulations! You hit the minimum score!');

        this.set('waveStarted', false);
      } else {
        console.log('Oh no! You did not reach the minimum score!');

        this.set('waveStarted', false);
      }
    },

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
