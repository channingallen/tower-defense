import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['mob--container'],

  classNameBindings: [
    'right:board__mob--right'
  ],

  mobPosition: Ember.computed('attrs.path.[]', function () {
    return 'mob--position-x-1-y-1';
  })
});
