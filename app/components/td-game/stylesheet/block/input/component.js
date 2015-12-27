import Ember from 'ember';

export default Ember.Component.extend({
  inputValid: false,

  inputValue: null,

  inputViewName: 'input', // This can be called anything.

  _autoFocusInput: Ember.observer(
    'attrs.selectedTower',
    'attrs.selectedTowerGroup',
    'attrs.tower',
    'attrs.towerGroup',
    function () {
      if (this.attrs.selectedTower &&
          this.attrs.selectedTower === this.attrs.tower) {
        console.log('selected tower changed'); // TODO THIS COMMIT: remove this
        const inputViewName = this.get('inputViewName');
        const inputComponent = this.get(inputViewName);
        const inputEl = inputComponent.get('element');
        inputEl.focus();
      } else if (this.attrs.selectedTowerGroup &&
                 this.attrs.selectedTowerGroup === this.attrs.towerGroup) {
        console.log('selected tower group changed'); // TODO THIS COMMIT: remove this
        const inputViewName = this.get('inputViewName');
        const inputComponent = this.get(inputViewName);
        const inputEl = inputComponent.get('element');
        inputEl.focus();
      }
    }
  ),

  actions: {
    addValue(string) {
      this.set('inputValue', string);
    },

    handleInputEnter() {
      if (this.get('inputValid') && this.attrs['enter-code-line']) {
        this.attrs['enter-code-line'](this.get('inputValue'));
      }
    },

    handleKeyUp(value) {
      this.set('inputValue', value);

      const validText = 'asdf';
      if (this.get('inputValue') === validText) {
        this.set('inputValid', true);
      } else {
        this.set('inputValid', false);
      }
    }
  }
});
