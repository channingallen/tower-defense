import Ember from 'ember';

export default Ember.Component.extend({
  inputValid: false,

  inputValue: null,

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
