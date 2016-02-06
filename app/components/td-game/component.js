import Ember from 'ember';
import createGame from 'tower-defense/utils/create-game';

////////////////
//            //
//   Basics   //
//            //
////////////////

const GameComponent = Ember.Component.extend({
  classNames: ['td-game']
});

/////////////////////////
//                     //
//   Wave Management   //
//                     //
/////////////////////////

GameComponent.reopen({
  currentWaveNumber: 1,

  game: createGame(),

  waveStarted: false,

  currentWave: Ember.computed(
    'currentWaveNumber',
    'game.waves.[]',
    function () {
      return this.get('game.waves').objectAt(this.get('currentWaveNumber') - 1);
    }
  ),

  _resetGame: Ember.observer('waveStarted', function () {
    if (!this.get('waveStarted')) {
      this.set('game', createGame());
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

    startWave() {
      this.set('waveStarted', true);
    }
  }
});

////////////////////////
//                    //
//   Flexbox Styles   //
//                    //
////////////////////////

GameComponent.reopen({
  twrStyles: null,

  twrGrpStyles: null,

  actions: {
    setStyles(blockCodeLines) {
      if (this.get('selectedTowerGroup')) {
        this.set('selectedTowerGroup.styles', blockCodeLines);
      }

      if (this.get('selectedTower')) {
        this.set('selectedTower.styles', blockCodeLines);
      }
    }
  }
});

/////////////////////////
//                     //
//   Tower Selection   //
//                     //
/////////////////////////

GameComponent.reopen({
  selectedTower: null,

  selectedTowerGroup: null,

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
    }
  }
});

//////////////////////////
//                      //
//   Tower Collisions   //
//                      //
//////////////////////////

GameComponent.reopen({
  collidingTowers: Ember.computed('currentWaveNumber', function () {
    return [];
  }),

  towersColliding: Ember.computed('collidingTowers.[]', function () {
    return !!this.get('collidingTowers.length');
  }),

  actions: {
    addCollidingTower(towerId) {
      this.get('collidingTowers').addObject(towerId);
    },

    removeCollidingTower(towerId) {
      this.get('collidingTowers').removeObject(towerId);
    }
  }
});

export default GameComponent;
