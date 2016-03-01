import Ember from 'ember';

const Wave = Ember.Object.extend({
  board: null,
  instructions: null,
  minimumScore: null,
  mobs: null,
  towerStylesHidden: null,
  towerGroups: null
});

export default Wave;
