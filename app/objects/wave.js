import Ember from 'ember';

const Wave = Ember.Object.extend({
  board: null,
  instructions: null,
  minimumScore: null,
  mobs: null,
  towerGroups: null
});

export default Wave;
