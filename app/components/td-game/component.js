import Ember from 'ember';
import createGame from 'tower-defense/utils/create-game';
/* global marked */

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
        this._refreshOverlayAndModal();
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
        this._refreshOverlayAndModal();
      }

    },

    // TODO THIS COMMIT: this is never currently called
    changeWaveSelect(waveNum) {
      if (this.get('waveStarted')) {
        console.error('You cannot start a new wave until this wave ends.');
        return;
      }

      this.set('currentWaveNumber', waveNum);

      this._refreshOverlayAndModal();
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

/////////////////
//             //
//   Overlay   //
//             //
/////////////////

GameComponent.reopen({
  overlayShown: true,

  _hideOverlay() {
    this.set('overlayShown', false);
  },

  _refreshOverlayAndModal() {
    this._hideGradeModal();
    this._showInstructionsModal();
    this._showOverlay();
  },

  _showOverlay() {
    this.set('overlayShown', true);
  },

  actions: {
    hideOverlay() {
      this._hideOverlay();
      this._hideInstructionsModal();
      this._hideGradeModal();
    }
  }
});

//////////////////////////
//                      //
//   Score Management   //
//                      //
//////////////////////////

GameComponent.reopen({
  gradeModalShown: false,

  passed: false,

  _hideGradeModal() {
    this.set('gradeModalShown', false);
  },

  _showGradeModal() {
    this.set('gradeModalShown', true);
  },

  score: null,

  actions: {
    scoreWave(wavePoints) {
      this.set('score', wavePoints);

      if (wavePoints >= this.get('currentWave.minimumScore')) {
        this.set('passed', true);
      } else {
        this.set('passed', false);
      }

      this._showGradeModal();
      this._showOverlay();

      this.set('waveStarted', false);
    }
  }
});

//////////////////////
//                  //
//   Instructions   //
//                  //
//////////////////////

GameComponent.reopen({
  instructionsModalShown: true,

  _hideInstructionsModal() {
    this.set('instructionsModalShown', false);
  },

  _showInstructionsModal() {
    this.set('instructionsModalShown', true);
  },

  instructions: Ember.computed('currentWaveNumber', function () {
    return marked(this.get('currentWave.instructions'));
  })
});

export default GameComponent;
