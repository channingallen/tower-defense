import Ember from 'ember';
import createFlexboxRef from 'tower-defense/utils/create-flexbox-ref';

export default Ember.Component.extend({
  flexboxRef: createFlexboxRef(),

  focusInCount: 0,

  focusOutCount: 0,

  inputValue: null,

  inputViewName: 'input', // This can be called anything.

  _focusInput() {
    const inputViewName = this.get('inputViewName');
    const inputComponent = this.get(inputViewName);
    const inputEl = inputComponent.get('element');
    inputEl.focus();
  },

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

  _getValWithoutSemiColon(val) {
    const lastIndex = val.length - 1;
    if (val[lastIndex] === ';') {
      return val.substring(0, lastIndex);
    }
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

    let fullValue = this.get('inputValue').substring(startIndex, endIndex).trim();
    if (fullValue[fullValue.length - 1] !== ';') {
      return false;
    }

    let value = this._getValWithoutSemiColon(fullValue);

    let valueFound = false;
    this.get('flexboxRef')[property].forEach(function (validValue) {
      if (value === validValue.toString()) {
        valueFound = true;
      }
    });

    return valueFound ? true : false;
  },

  focusNewInput: Ember.computed('attrs.blockSubmitted', function () {
    if (!this.attrs.finalInputFound) {
      return false;
    }
    return !this.attrs.blockSubmitted;
  }),

  inputEmpty: Ember.computed('inputValue', function () {
    if (!this.get('inputValue')) {
      return true;
    }

    return this.get('inputValue') === '' ? true : false;
  }),

  inputValid: Ember.computed('inputValue', function () {
    return this._validPropertyFound() && this._validValueFound();
  }),

  submitted: Ember.computed('attrs.blockSubmitted', function () {
    return !!this.attrs.blockSubmitted;
  }),

  _focusIfFirstInput: Ember.on('didInsertElement', function () {
    if (this.attrs.unitId === this.attrs.firstTowerGroupId) {
      this._focusInput();
    }
  }),

  _focusMatchedInput: Ember.observer(
    'attrs.inputIdToFocus',
    function () {
      if (this.attrs.inputIdToFocus === this.attrs.codeLineId) {
        this._focusInput();
      }
    }
  ),

  _notifyOnFinalInput: Ember.on('didInsertElement', function () {
    if (this.attrs.unitId === this.attrs.finalTowerId) {
      this.attrs['notify-final-input']();
    }
  }),

  _resetInput: Ember.observer('attrs.waveStarted', function () {
    if (!this.attrs.waveStarted) {
      this.set('flexboxRef', createFlexboxRef());
      this.set('focusInCount', 0);
      this.set('focusOutCount', 0);
      this.set('inputValue', null);
    }
  }),

  _sendFocusedState: Ember.observer('focusInCount', 'focusOutCount', function () {
    const focusInCount = this.get('focusInCount');
    const focusOutCount = this.get('focusOutCount');

    if (focusInCount > focusOutCount) {
      this.attrs['disable-autofocus'](this.attrs.codeLineId);
    } else {
      this.attrs['enable-autofocus'](this.attrs.codeLineId);
    }
  }),

  actions: {
    handleFocusIn() {
      const focusInCount = this.get('focusInCount');
      this.set('focusInCount', focusInCount + 1);

      let unit;
      let attribute;

      if (this.attrs.tower) {
        unit = this.attrs.tower;
        attribute = 'tower';
      } else {
        unit = this.attrs.towerGroup;
        attribute = 'tower-group';
      }

      this.attrs['select-' + attribute](unit);
    },

    handleFocusOut() {
      const focusOutCount = this.get('focusOutCount');
      this.set('focusOutCount', focusOutCount + 1);
    },

    handleInputEnter() {
      if (this.get('inputValid')) {
        this.attrs['submit-code-line'](
          this.get('inputValue'),
          this.attrs.codeLineId
        );
      } else if (this.get('inputEmpty')) {
        this.attrs['delete-code-line'](this.attrs.codeLineId);
      } else {
        this.attrs['shake-stylesheet']();
      }
    },

    handleKeyUp(keyUpVal) {
      this.set('inputValue', keyUpVal);
    }
  }
});
