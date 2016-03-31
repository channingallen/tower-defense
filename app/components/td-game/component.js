import Ember from 'ember';
import createGame from 'tower-defense/utils/create-game';
/* global marked */

/**
 * Basics
 * Wave Management
 * Tower Selection
 * Tower Collisions
 * Instructions Tooltip
 * Dropdown Menu
 * Tower Input Checkbox
 * Deselect Units
 * Modal: Grade (Score Management)
 * Modal: Instructions
 * Modal: Cancellation (Wave Cancellation)
 * Modal: Support
 */

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
      this.set('cancellingWave', false);
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

//////////////////////////////
//                          //
//   Instructions Tooltip   //
//                          //
//////////////////////////////

GameComponent.reopen({
  instructionToolTipProperty: null,

  instructionToolTipShown: false,

  _showInstructionTooltip: Ember.on(
    'didInsertElement',
    Ember.observer('overlayShown', function () {
      Ember.run.schedule('afterRender', this, () => {
        if (!this.get('overlayShown')) {
          this.$('.text__code').on('mouseover', (mouseoverEvent) => {
            this.set('instructionToolTipShown', true);

            const $hoverElement = Ember.$(mouseoverEvent.target);
            this.set('instructionToolTipProperty', $hoverElement.text());
            Ember.$('.instructions__tooltip').css({
              display: 'block',
              left: `${$hoverElement.offset().left}px`,
              top: `${$hoverElement.offset().top + 20}px`,
            });
          });

          this.$('.text__code').on('mouseout', () => {
            Ember.$('.instructions__tooltip').css('display', 'none');
            this.set('instructionToolTipShown', false);
            this.set('instructionToolTipProperty', null);
          });
        }
      });
    })
  )
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

  _preventSidebarScroll: Ember.observer('dropdownActive', function () {
    if (this.get('dropdownActive')) {
      this.$('.td-game__sidebar').css('overflow-y', 'visible');
    } else {
      this.$('.td-game__sidebar').css('overflow-y', 'auto');
    }
  }),

  actions: {
    openDropdown() {
      this.set('dropdownActive', true);
    }
  }
});

//////////////////////////////
//                          //
//   Tower Input Checkbox   //
//                          //
//////////////////////////////

GameComponent.reopen({
  towerStylesHidden: true,

  _resetTowerStylesHidden: Ember.observer('currentWaveNumber', function () {
    this.set('towerStylesHidden', this.get('currentWave.towerStylesHidden'));
  }),

  actions: {
    hideTowerInputs() {
      this.set('towerStylesHidden', true);
    },

    showTowerInputs() {
      this.set('towerStylesHidden', false);
    }
  }
});

////////////////////////
//                    //
//   Deselect Units   //
//                    //
////////////////////////

GameComponent.reopen({
  _handleClick: Ember.on('didInsertElement', function () {
    this.$().click((clickEvent) => {
      const $clickedEl = Ember.$(clickEvent.target);

      const $towerGroupParents = $clickedEl.closest('.board__tower-group');
      const isChildOfTowerGroup = $towerGroupParents.length > 0;

      const $inputContainerParents = $clickedEl.closest('.block__input-container');
      const isChildOfInputContainer = $inputContainerParents.length > 0;

      const $toolTipParents = $clickedEl.closest('.tool-tip');
      const isChildOfToolTip = $toolTipParents.length > 0;

      const isOverlay = $clickedEl.hasClass('overlay');

      const isPulse = $clickedEl.hasClass('tower-group__pulse');

      if (!isChildOfTowerGroup &&
          !isChildOfInputContainer &&
          !isChildOfToolTip &&
          !isOverlay &&
          !isPulse) {
        this.set('selectedTower', null);
        this.set('selectedTowerGroup', null);
      }
    });
  })
});

/////////////////
//             //
//   Overlay   //
//             //
/////////////////

GameComponent.reopen({
  overlayShown: true,

  _hideModalsOnly() {
    this._hideInstructionsModal();
    this._hideGradeModal();
    this._hideCancellationModal();
    this._hideSupportModal();
  },

  _hideOverlay() {
    this.set('overlayShown', false);
  },

  _hideOverlayAndModals() {
    this._hideOverlay();
    this._hideModalsOnly();
  },

  _refreshOverlayAndModal() {
    this._hideModalsOnly();
    this._showInstructionsModal();
    this._showOverlay();
  },

  _showOverlay() {
    this.set('overlayShown', true);
  },

  _escapeOverlay: Ember.on('didInsertElement', function () {
    Ember.$(window).on('keydown', (keyEvent) => {
      if (this.get('overlayShown') && keyEvent.which === 27) {
        this._hideOverlayAndModals();
      }
    });
  }),

  actions: {
    // hide overlay whenever user "clicks out" of modal
    handleOverlayClick(event) {
      // the directly-clicked element (event.target), must be the overlay
      // (event.currentTarget) for the overlay to remain
      if (event.currentTarget === event.target) {
        this._hideOverlayAndModals();
      }
    },

    hideOverlay() {
      this._hideOverlayAndModals();
    },

    showOverlay() {
      this._showInstructionsModal();
      this._showOverlay();
    }
  }
});


////////////////////////////
//                        //
//      Modal: Grade      //
//   (Score Management)   //
//                        //
////////////////////////////

GameComponent.reopen({
  gradeModalShown: false,

  passed: false,

  score: null,

  _hideGradeModal() {
    this.set('gradeModalShown', false);
  },

  _showGradeModal() {
    this.set('gradeModalShown', true);
  },

  actions: {
    scoreWave(wavePoints) {
      this.set('score', wavePoints);

      if (wavePoints >= this.get('currentWave.minimumScore')) {
        this.set('passed', true);
      } else {
        this.set('passed', false);
      }

      Ember.run.later(this, () => {
        this._showGradeModal();
        this._showOverlay();

        this.set('waveStarted', false);
      }, 1000);
    }
  }
});

/////////////////////////////
//                         //
//   Modal: Instructions   //
//                         //
/////////////////////////////

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

/////////////////////////////
//                         //
//   Modal: Cancellation   //
//   (Wave Cancellation)   //
//                         //
/////////////////////////////

GameComponent.reopen({
  cancellationModalShown: false,

  cancellingWave: false,

  _beginWaveCancellation() {
    this.set('cancellingWave', true);

    const mobFrequency = this.get('currentWave.mobs').objectAt(0).get('frequency');
    Ember.run.later(this, () => {
      this.set('waveStarted', false);
    }, mobFrequency);
  },

  _hideCancellationModal() {
    this.set('cancellationModalShown', false);
  },

  _showCancellationModal() {
    this.set('cancellationModalShown', true);
  },

  // until timing functions account for tabbing out, cancel waves on blur
  _autoBeginWaveCancellation: Ember.on('didInsertElement', function () {
    Ember.$(document).on('visibilitychange', () => {
      if (this.get('waveStarted')) {
        this._beginWaveCancellation();

        this._showCancellationModal();
        this._showOverlay();
      }
    });
  }),

  actions: {
    beginWaveCancellation() {
      this._beginWaveCancellation();
    }
  }
});

////////////////////////
//                    //
//   Modal: Support   //
//                    //
////////////////////////

GameComponent.reopen({
  supportModalShown: false,

  _hideSupportModal() {
    this.set('supportModalShown', false);
  },

  _showSupportModal() {
    this.set('supportModalShown', true);
  },

  actions: {
    hideSupportModal() {
      this.set('supportModalShown', false);
    },

    showSupportModal() {
      this._hideModalsOnly();
      this._showSupportModal();
    }
  }
});

export default GameComponent;
