import Ember from 'ember';
import createFlexboxRef from 'tower-defense/utils/create-flexbox-ref';

export default Ember.Component.extend({
  flexboxRef: createFlexboxRef(),

  inputValid: false,

  inputValue: null,

  inputViewName: 'input', // This can be called anything.

  _getValidProperty(keyUpVal) {
    keyUpVal = keyUpVal.toLowerCase();
    let property;

    const colonLocation = keyUpVal.indexOf(':');
    if (colonLocation > 0) {
      property = keyUpVal.substring(0, colonLocation);
    } else {
      return undefined;
    }

    let propertyFoundInFlexboxRef = false;
    if (this.get('flexboxRef')[property]) {
      propertyFoundInFlexboxRef = true;
    }

    return propertyFoundInFlexboxRef ? property : undefined;
  },

  _getValidValue(keyUpVal, propertyString) {
    keyUpVal = keyUpVal.toLowerCase();
    const startIndex = propertyString.length + 1;
    const endIndex = keyUpVal.length;

    let value = keyUpVal.substring(startIndex, endIndex).trim();
    let valueFoundInFlexboxProp = false;
    this.get('flexboxRef')[propertyString].forEach(function (validValue) {
      if (value === validValue.toString()) {
        valueFoundInFlexboxProp = true;
      }
    });

    return valueFoundInFlexboxProp ? value : undefined;
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
    delete() {
      this.attrs['delete-code-line'](this.attrs.unitType, this.attrs.blockId);
    },

    handleInputEnter() {
      if (this.get('inputValid')) {
        this.attrs['submit-code-line'](
          this.get('inputValue'),
          this.attrs.unitType,
          this.attrs.blockId
        );
      } else {
        this.attrs['shake-stylesheet']();
      }
    },

    handleKeyUp(keyUpVal) {
      this.set('inputValue', keyUpVal);

      const validProperty = this._getValidProperty(keyUpVal);
      let validValue;

      if (validProperty !== undefined) {
        validValue = this._getValidValue(keyUpVal, validProperty);
      } else {
        return;
      }

      if (validValue !== undefined) {
        this.set('inputValid', true);
      } else {
        this.set('inputValid', false);
      }
    }
  }
});
