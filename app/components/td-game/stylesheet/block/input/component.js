import Ember from 'ember';
import createFlexboxRef from 'tower-defense/utils/create-flexbox-ref';

export default Ember.Component.extend({
  flexboxRef: createFlexboxRef(),

  inputValue: null,

  inputViewName: 'input', // This can be called anything.

  inputEmpty: Ember.computed('inputValue', function () {
    if (!this.get('inputValue')) {
      return true;
    }

    return this.get('inputValue') === '' ? true : false;
  }),

  inputValid: Ember.computed('inputValue', function () {
    return this._validPropertyFound() && this._validValueFound();
  }),

  _getProperty() {
    const inputValueLowerCase = this.get('inputValue').toLowerCase();
    const colonLocation = inputValueLowerCase.indexOf(':');

    return inputValueLowerCase.substring(0, colonLocation);
  },

  _focusInput() {
    const inputViewName = this.get('inputViewName');
    const inputComponent = this.get(inputViewName);
    const inputEl = inputComponent.get('element');
    inputEl.focus();
  },

  _propertyFound() {
    if (this.get('inputEmpty')) {
      return false;
    }

    const colonLocation = this.get('inputValue').indexOf(':');
    return colonLocation < 1 ? false : true;
  },

  _validPropertyFound() {
    if (!this._propertyFound()) {
      return false;
    }

    const property = this._getProperty();
    if (!this.get('flexboxRef')[property]) {
      return false;
    }

    return true;
  },

  _validValueFound() {
    if (!this._propertyFound()) {
      return false;
    }
    const property = this._getProperty();
    const startIndex = property.length + 1;
    const endIndex = this.get('inputValue.length');
    let value = this.get('inputValue').substring(startIndex, endIndex).trim();

    let valueFound = false;
    this.get('flexboxRef')[property].forEach(function (validValue) {
      if (value === validValue.toString()) {
        valueFound = true;
      }
    });

    return valueFound ? true : false;
  },

  _autoFocusInput: Ember.observer(
    'attrs.clickedStylesheet',
    'attrs.selectedTower',
    'attrs.selectedTowerGroup',
    'attrs.tower',
    'attrs.towerGroup',
    function () {
      const waveStarted = this.attrs.waveStarted;
      const clickedStylesheet = this.attrs.clickedStylesheet;
      if (this.get('submitted') || clickedStylesheet || waveStarted) {
        return;
      }

      const towerSelected = this.attrs.selectedTower &&
        this.attrs.selectedTower === this.attrs.tower;

      const towerGroupSelected = this.attrs.selectedTowerGroup &&
        this.attrs.selectedTowerGroup === this.attrs.towerGroup;

      if (towerSelected || towerGroupSelected) {
        this._focusInput();
      }
    }
  ),

  focusNewInput: Ember.computed('attrs.blockSubmitted', function () {
    if (!this.attrs.finalInputFound) {
      return false;
    }
    return !this.attrs.blockSubmitted;
  }),

  focusIfFirstInput: Ember.on('didInsertElement', function () {
    if (this.attrs.unitId === this.attrs.firstTowerGroupId) {
      this._focusInput();
    }
  }),

  submitted: Ember.computed('attrs.blockSubmitted', function () {
    return !!this.attrs.blockSubmitted;
  }),

  notifyOnFinalInput: Ember.on('didInsertElement', function () {
    if (this.attrs.unitId === this.attrs.finalTowerId) {
      this.attrs['notify-final-input']();
    }
  }),

  actions: {
    handleInputEnter() {
      if (this.get('inputValid')) {
        this.attrs['submit-code-line'](
          this.get('inputValue'),
          this.attrs.blockId
        );
      } else if (this.get('inputEmpty')) {
        this.attrs['delete-code-line'](this.attrs.blockId);
      } else {
        this.attrs['shake-stylesheet']();
      }
    },

    handleKeyUp(keyUpVal) {
      this.set('inputValue', keyUpVal);
    },

    selectUnit() {
      this.attrs.click(
        this.attrs.tower ? this.attrs.tower : this.attrs.towerGroup
      );
    },
  }
});
