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
      if (this.get('submitted') || this.attrs.clickedStylesheet) {
        return;
      }

      const towerSelected = this.attrs.selectedTower &&
        this.attrs.selectedTower === this.attrs.tower;

      const towerGroupSelected = this.attrs.selectedTowerGroup &&
        this.attrs.selectedTowerGroup === this.attrs.towerGroup;

      if (towerSelected || towerGroupSelected) {
        const inputViewName = this.get('inputViewName');
        const inputComponent = this.get(inputViewName);
        const inputEl = inputComponent.get('element');
        inputEl.focus();
      }
    }
  ),

  focusNewInput: Ember.computed('attrs.blockSubmitted', function () {
    return !this.attrs.blockSubmitted;
  }),

  submitted: Ember.computed('attrs.blockSubmitted', function () {
    return !!this.attrs.blockSubmitted;
  }),

  actions: {
    // TODO THIS COMMIT: is this called?
    delete() {
      this.attrs['delete-code-line'](this.attrs.blockId);
    },

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
    }
  }
});
