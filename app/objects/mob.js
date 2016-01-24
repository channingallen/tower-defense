import Ember from 'ember';

const Mob = Ember.Object.extend({
  id: null,
  frequency: null,
  health: null,
  maxHealth: null,
  points: null,
  posX: null,
  posY: null,
  quantity: null,
  speed: null,
  type: null
});

export default Mob;
