import Ember from 'ember';
import createFlexboxRef from 'tower-defense/utils/create-flexbox-ref';

/**
 * Basics
 * Submission Processing
 * Focus
 * Flexbox Validation
 */

////////////////
//            //
//   Basics   //
//            //
////////////////

const InputComponent = Ember.Component.extend({
  inputValue: null,

  inputViewName: 'input', // This can be called anything.

  inputEmpty: Ember.computed('inputValue', function () {
    if (!this.get('inputValue')) {
      return true;
    }

    return this.get('inputValue') === '' ? true : false;
  }),

  actions: {
    handleInputEnter() {
      this._submitCode();
    },

    handleKeyDown(keyDownVal, keyDownEvent) {
      const tabKey = 9;
      const enterKey = 13;
      if (keyDownEvent.which === tabKey || keyDownEvent.which === enterKey) {
        this.set('inputValue', keyDownVal);
      }
    },

    handleKeyUp(keyUpVal) {
      this.set('inputValue', keyUpVal);
    }
  }
});

///////////////////////////////
//                           //
//   Submission Processing   //
//                           //
///////////////////////////////

InputComponent.reopen({
  _appendSemicolon() {
    const inputValue = this.get('inputValue');
    this.set('inputValue', inputValue.concat(';'));
  },

  _checkForSemicolon() {
    return this.get('inputValue').endsWith(';');
  },

  _submitCode() {
    if (this.get('inputValid')) {
      if (!this._checkForSemicolon()) {
        this._appendSemicolon();
      }

      this.attrs['submit-code-line'](
        this.get('inputValue'),
        this.attrs.codeLineId,
        true
      );
    } else if (this.get('inputEmpty')) {
      this.attrs['delete-code-line'](this.attrs.codeLineId);
    } else {
      this.attrs['shake-stylesheet']();

      this.attrs['submit-code-line'](
        this.get('inputValue'),
        this.attrs.codeLineId,
        false
      );
    }
  }
});

///////////////
//           //
//   Focus   //
//           //
///////////////

InputComponent.reopen({
  focusInCount: 0,

  focusOutCount: 0,

  _focusInput() {
    const inputViewName = this.get('inputViewName');
    const inputComponent = this.get(inputViewName);
    const inputEl = inputComponent.get('element');
    inputEl.focus();
  },

  shouldFocusNewInput: Ember.computed('attrs.blockSubmitted', function () {
    if (!this.attrs.finalInputFound || this.attrs.overlayShown) {
      return false;
    }

    return !this.attrs.blockSubmitted;
  }),

  _focusIfFirstInput: Ember.on('didInsertElement',
    Ember.observer('overlayShown', function () {
      Ember.run.schedule('afterRender', this, () => {
        if (this.attrs.unitId === this.attrs.firstTowerGroupId && !this.attrs.overlayShown) {
          this._focusInput();
        }
      });
    })
  ),

  // This function will only fire if the current input field was manually
  // selected (by a click or tab event) or if it is the unsubmitted input at the
  // end of the block. The business logic contained in the block's
  // _focusProperInput() function determines when to select which.
  _focusMatchedInput: Ember.observer(
    'attrs.inputIdToFocus',
    function () {
      if (this.attrs.inputIdToFocus === this.attrs.codeLineId) {
        this._focusInput();
      }
    }
  ),

  _notifyOnFinalInput: Ember.on('didInsertElement', function () {
    Ember.run.schedule('afterRender', this, () => {
      if (this.attrs.unitId === this.attrs.finalTowerId) {
        this.attrs['notify-final-input']();
      }
    });
  }),

  _sendFocusedState: Ember.observer(
    'focusInCount',
    'focusOutCount',
    function () {
      const focusInCount = this.get('focusInCount');
      const focusOutCount = this.get('focusOutCount');

      // autofocus is the block's function for automatically focusing on the
      // unsubmitted input
      if (focusInCount > focusOutCount) {
        this.attrs['disable-autofocus'](this.attrs.codeLineId);
      } else {
        this.attrs['enable-autofocus'](this.attrs.codeLineId);
      }
    }
  ),

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

      this._submitCode();
    }
  }
});

////////////////////////////
//                        //
//   Flexbox Validation   //
//                        //
////////////////////////////

InputComponent.reopen({
  flexboxRef: createFlexboxRef(),

  _getProperty() {
    const inputValueLowerCase = this.get('inputValue').toLowerCase();
    const colonLocation = inputValueLowerCase.indexOf(':');

    return inputValueLowerCase.substring(0, colonLocation);
  },

  _getValWithoutSemiColon(val) {
    const lastIndex = val.length - 1;
    if (val[lastIndex] === ';') {
      return val.substring(0, lastIndex);
    }
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

    const propertyType = this.attrs.tower ? 'item' : 'container';
    const property = this._getProperty();
    if (!this.get('flexboxRef').get(propertyType)[property]) {
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

    const inputValueLowerCase = this.get('inputValue').toLowerCase();
    let fullValue = inputValueLowerCase.substring(startIndex, endIndex).trim();
    const semicolonFound = fullValue[fullValue.length - 1] === ';';
    let value;
    if (semicolonFound) {
      value = this._getValWithoutSemiColon(fullValue);
    } else {
      value = fullValue;
    }

    const propertyType = this.attrs.tower ? 'item' : 'container';
    let valueFound = false;
    this.get('flexboxRef').get(propertyType)[property].forEach(function (validValue) {
      if (value === validValue.toString()) {
        valueFound = true;
      }
    });

    return valueFound ? true : false;
  },

  inputValid: Ember.computed('inputValue', function () {
    return this._validPropertyFound() && this._validValueFound();
  })
});

export default InputComponent;
