import Ember from 'ember';

////////////////
//            //
//   Basics   //
//            //
////////////////

const StylesheetComponent = Ember.Component.extend({
  classNames: ['sidebar__stylesheet']
});

/////////////////////
//                 //
//   Block Lines   //
//                 //
/////////////////////

StylesheetComponent.reopen({
  // 2 per TG
  _addLinesForTowerGroupBraces(blockLineNumbers) {

  },

  // 2 per T
  _addLinesForTowerBraces(blockLineNumbers) {

  },

  _addLinesForTowerGroupInputs(blockLineNumbers) {

  },

  _addLinesForTowerInputs(blockLineNumbers) {

  },

  // TG + T - 1
  _addLinesForLineBreaks(blockLineNumbers) {

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

  blockLineNumbers: Ember.computed(
    'attrs.towersGroups.[]',
    'towers.[]',
    'towerGroupStyles.[]',
    'towerStyles.[]',
    function () {
      let blockLineNumbers = [];

      this._addLinesForTowerGroupBraces(blockLineNumbers); // 2 per TG
      this._addLinesForTowerBraces(blockLineNumbers); // 2 per T
      this._addLinesForTowerGroupInputs(blockLineNumbers);
      this._addLinesForTowerInputs(blockLineNumbers);
      this._addLinesForLineBreaks(blockLineNumbers); // TG + T - 1

      return blockLineNumbers;
    }
  ),

  test: Ember.on('didInsertElement', function () {
    // debugger; // TODO THIS COMMIT: remove this
  }),

  // numInputs: Ember.computed(
  //   'towerGroupStyles',
  //   'towerStyles',
  //   function () {
  //     return this.get('towerGroupStyles.length') + this.get('towerStyles.length');
  //   }
  // ),

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
  }),

  actions: {
    handleSubmitStyles(blockCodeLines) {
      this.attrs['submit-styles'](blockCodeLines);
    }
  }
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

  actions: {
    shake() {
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
  ))
});

export default StylesheetComponent;
