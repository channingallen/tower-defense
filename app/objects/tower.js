import Ember from 'ember';

const Tower = Ember.Object.extend({
  // system: multiple numerical types:
  // 1. single tower to the left
  // 2. single tower in the middle
  // 3. single tower to the right
  // 4. two towers, left and center
  // etc...
  type: null
});

export default Tower;
