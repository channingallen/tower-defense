import Ember from 'ember';

export function initialize(/* application */) {
  Ember.Component.reopen({
    elementInserted: false,

    _updateElementInserted: Ember.on('didInsertElement', function () {
      Ember.run.schedule('afterRender', this, () => {
        this.set('elementInserted', true);
      });
    })
  });
}

export default {
  name: 'add-insertion-detection-to-components',
  initialize
};
