import Ember from 'ember';

////////////////
//            //
//   Basics   //
//            //
////////////////

const StylesheetComponent = Ember.Component.extend({
  classNames: ['sidebar__stylesheet']
});

//////////////////////
//                  //
//   Tower Inputs   //
//                  //
//////////////////////

StylesheetComponent.reopen({
  towerInputsHidden: true,

  _showTowerInputs: Ember.observer('towerInputsHidden', function () {
    if (!this.get('towerInputsHidden')) {
      this.attrs['show-tower-inputs']();
    }
  }),

  _hideTowerInputs: Ember.observer('towerInputsHidden', function () {
    if (this.get('towerInputsHidden')) {
      this.attrs['hide-tower-inputs']();
    }
  }),

  _resetTowerInputsHidden: Ember.observer('attrs.towerStylesHidden', function () {
    this.set('towerInputsHidden', this.attrs.towerStylesHidden);
  }),

  actions: {
    toggleHideInputs() {
      this.set('towerInputsHidden', !this.get('towerInputsHidden'));
    }
  }
});

/////////////////////////
//                     //
//   Wave Initiation   //
//                     //
/////////////////////////

StylesheetComponent.reopen({
  waveStarting: false,

  _falsifyWaveStarting: Ember.observer('waveStarted', function () {
    if (this.attrs.waveStarted) {
      this.set('waveStarting', false);
    }
  }),

  // shift + enter hotkey
  _startWave: Ember.observer('attrs.overlayShown', function () {
    if (this.attrs.overlayShown) {
      Ember.$(window).off('keypress');
    } else {
      Ember.$(window).on('keypress', (keyEvent) => {
        if (keyEvent.shiftKey && keyEvent.which === 13) {
          if (this.attrs.towersColliding) {
            this._shake();
            return;
          }

          this.set('waveStarting', true);
          this.attrs['start-wave']();
        }
      });
    }
  }),

  actions: {
    startWave() {
      this.set('waveStarting', true);
      this.attrs['start-wave']();
    }
  }
});

///////////////////////////
//                       //
//   Wave Cancellation   //
//                       //
///////////////////////////

StylesheetComponent.reopen({
  actions: {
    cancelWave() {
      this.attrs['cancel-wave']();
    }
  }
});

/////////////////////
//                 //
//   Block Lines   //
//                 //
/////////////////////

StylesheetComponent.reopen({
  _getLinesForBraces() {
    let count = 0;
    const towerGroups = this.attrs.towerGroups;
    let towersAndTowerGroups = this.attrs.towerStylesHidden ?
                               towerGroups :
                               towerGroups.concat(this.get('towers'));

    towersAndTowerGroups.forEach(() => {
      for (let i = 0; i < 2; i++) {
        count++;
      }
    });

    return count;
  },

  _getLinesForInputs() {
    let count = 0;
    const towerGroupStyles = this.get('towerGroupStyles');
    let towerAndTowerGroupStyles = this.attrs.towerStylesHidden ?
                                   towerGroupStyles :
                                   towerGroupStyles.concat(this.get('towerStyles'));

    towerAndTowerGroupStyles.forEach(() => {
      count++;
    });

    return count;
  },

  // Line breaks: TG + T - 1
  _getLinesForLineBreaks() {
    let count = 0;
    const numTowers = this.get('towers.length');
    const numTowerGroups = this.attrs.towerGroups.length;
    const numTowersAndTowerGroups = this.attrs.towerStylesHidden ?
                                    numTowerGroups :
                                    numTowers + numTowerGroups;
    const numLineBreakLines = numTowersAndTowerGroups - 1;

    for (let i = 0; i < numLineBreakLines; i++) {
      count++;
    }

    return count;
  },

  // Manual properties (display: flex): 1 per tower group
  _getLinesForManualProperties() {
    return this.attrs.towerGroups.length;
  },

  _flatten(arrays) {
    let items = Ember.A([]);

    arrays.forEach((array) => {
      array.forEach((item) => {
        items.addObject(item);
      });
    });

    return items;
  },

  lineNumbers: Ember.computed(
    'attrs.currentWaveNumber',
    'attrs.towersGroups.[]',
    'attrs.waveStarted',
    'towerGroupStyles.[]',
    'towerStylesHidden',
    'towers.[]',
    'towerStyles.[]',
    function () {
      const lineCount = this._getLinesForManualProperties() +
        this._getLinesForBraces() +
        this._getLinesForInputs() +
        this._getLinesForLineBreaks(); // TG + T - 1

      let lineNumbers = [];
      for (let i = 1; i <= lineCount; i++) {
        lineNumbers.push(i);
      }

      return lineNumbers;
    }
  ),

  towerGroupStylesMapped: Ember.computed.mapBy('attrs.towerGroups', 'styles'),

  towerGroupStyles: Ember.computed(
    'attrs.currentWaveNumber',
    'attrs.waveStarted',
    'towerGroupStylesMapped.@each.[]',
    function () {
      return this._flatten(this.get('towerGroupStylesMapped'));
    }
  ),

  towersMapped: Ember.computed.mapBy('attrs.towerGroups', 'towers'),

  towers: Ember.computed('towersMapped.@each.[]', function () {
    return this._flatten(this.get('towersMapped'));
  }),

  towerStylesMapped: Ember.computed.mapBy('towers', 'styles'),

  towerStyles: Ember.computed('towerStylesMapped.@each.[]', function () {
    return this._flatten(this.get('towerStylesMapped'));
  })
});

/////////////////////
//                 //
//   Shake Error   //
//                 //
/////////////////////

StylesheetComponent.reopen({
  shakeActive: false,

  _delayNextShake() {
    this.set('shakeActive', true);

    Ember.run.later(this, () => {
      this.set('shakeActive', false);
    }, 1300);
  },

  _shake() {
    if (this.get('shakeActive')) {
      return;
    }

    this._delayNextShake();

    let l = 20;
    for (let i = 0; i < 10; i++) {
      this.$().animate({
        'margin-left': "+=" + (l = -l) + 'px',
        'margin-right': "-=" + l + 'px'
      }, 115);
    }
  },

  actions: {
    shake() {
      this._shake();
    }
  }
});

/////////////////////////
//                     //
//   Input Reporting   //
//                     //
/////////////////////////

StylesheetComponent.reopen({
  finalTowerId: null,

  firstTowerGroupId: null,

  finalInputFound: false,

  _setFirstAndFinalUnitIds: Ember.on('init', Ember.observer(
    'attrs.currentWaveNumber',
    'attrs.waveStarted',
    function () {
      if (!this.attrs.waveStarted) {
        const firstTowerGroup = this.attrs.towerGroups.get('firstObject');
        const firstTowerGroupId = firstTowerGroup.get('id');
        this.set('firstTowerGroupId', firstTowerGroupId);

        const finalTowerGroup = this.attrs.towerGroups.get('lastObject');
        const finalTower = finalTowerGroup.get('towers').get('lastObject');
        const finalTowerId = finalTower.get('id');
        this.set('finalTowerId', finalTowerId);
      }
    }
  )),

  actions: {
    notifyFinalInput() {
      this.set('finalInputFound', true);
    }
  }
});

export default StylesheetComponent;
