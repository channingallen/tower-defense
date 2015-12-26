import Ember from 'ember';

export function initialize() {
  Ember.TextField.reopen({
    _focusInput: Ember.on('didInsertElement', function () {
      if (this.attrs.focusOnInsert) {
        this.$().focus(); // this.$() === this.get('element'): fn vs const
      }
    })
  });
}

export default {
  name: 'extend-ember-text-field',
  initialize: initialize
};
