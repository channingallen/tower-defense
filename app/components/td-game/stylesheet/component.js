import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['sidebar__stylesheet'],

  actions: {
    submitCode() {
      alert('stylesheet component: submitting code...'); // TODO THIS COMMIT: make this actually submit
    }
  }
});
