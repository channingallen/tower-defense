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

  isFirstWave: Ember.computed('currentWaveNumber', function () {
    return this.get('currentWaveNumber') === 1 ? true : false;
  }),

  isLastWave: Ember.computed('currentWaveNumber', function () {
    return this.get('currentWaveNumber') === this.get('game.waves.length') ?
           true :
           false;
  }),

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

GameComponent.reopen({
  actions: {
    reportTowerPosition(id, axis, pos) {
      axis = axis.toUpperCase();

      this.get('currentWave.towerGroups').forEach((tg) => {
        tg.get('towers').forEach((tower) => {
          if (tower.get('id') === id) {
            tower.set('pos' + axis, pos);
          }
        });
      });
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
    // hide overlay whenever user "clicks out" of modal
    handleOverlayClick(event) {
      // the directly-clicked element (event.target), must be the overlay
      // (event.currentTarget) for the overlay to remain
      if (event.currentTarget === event.target) {
        this._hideOverlay();
        this._hideInstructionsModal();
        this._hideGradeModal();
      }
    },

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

  instructionsMain: Ember.computed('currentWaveNumber', function () {
    return marked(this.get('currentWave.instructions.main'));
  }),

  instructionsTldr: Ember.computed('currentWaveNumber', function () {
    return marked(this.get('currentWave.instructions.tldr'));
  })
});

///////////////////////
//                   //
//   Dropdown Menu   //
//                   //
///////////////////////

GameComponent.reopen({
  closeDropdownFn: null,

  dropdownActive: false,

  numDropdownClicks: 0,

  _deactivateDropdown(clickEvent) {
    clickEvent.stopPropagation();

    const $clickedElement = Ember.$(clickEvent.target);
    const clickedDropdownBtn = $clickedElement.hasClass('nav__button--selector') ||
                               $clickedElement.parents('.nav__button--selector').length > 0;
    const clickedButtonMenu = $clickedElement.hasClass('button__menu') ||
                              $clickedElement.parents('.button__menu').length > 0;

    if (clickedDropdownBtn) {
      this.incrementProperty('numDropdownClicks');
    }

    if (clickedDropdownBtn && this.get('numDropdownClicks') < 2 || clickedButtonMenu) {
      return;
    }

    this.set('numDropdownClicks', 0);
    this.set('dropdownActive', false);
  },

  waveLinks: Ember.computed('game', function () {
    let waveLink = [];

    for (let i = 1; i <= this.get('game.waves.length'); i++) {
      waveLink.addObject(i);
    }

    return waveLink;
  }),

  _toggleDropdown: Ember.observer('dropdownActive', function () {
    if (this.get('dropdownActive')) {
      const closeDropdownFn = Ember.run.bind(this, '_deactivateDropdown');

      Ember.$(window).on('click', closeDropdownFn);

      this.set('closeDropdownFn', closeDropdownFn);
    } else {
      Ember.$(window).off('click', this.get('closeDropdownFn'));
    }
  }),

  actions: {
    openDropdown() {
      this.set('dropdownActive', true);
    }
  }
});

////////////////////////
//                    //
//   Deselect Units   //
//                    //
////////////////////////

GameComponent.reopen({
  _sendSelectAction: Ember.on('didInsertElement', function () {
    this.$().click((clickEvent) => {
      const $clickedEl = Ember.$(clickEvent.target);

      const $towerGroupParents = $clickedEl.closest('.board__tower-group');
      const isChildOfTowerGroup = $towerGroupParents.length > 0;

      const $inputContainerParents = $clickedEl.closest('.block__input-container');
      const isChildOfInputContainer = $inputContainerParents.length > 0;

      const $toolTipParents = $clickedEl.closest('.tool-tip');
      const isChildOfToolTip = $toolTipParents.length > 0;

      const isOverlay = $clickedEl.hasClass('overlay');

      if (!isChildOfTowerGroup && !isChildOfInputContainer && !isChildOfToolTip && !isOverlay) {
        this.set('selectedTower', null);
        this.set('selectedTowerGroup', null);
      }
    });
  })
});

export default GameComponent;
