import Ember from 'ember';

// mobs are 4% the width/height of the board
export const mobDimensions = 4;

const Mob = Ember.Object.extend({
  id: null,
  active: null,
  frequency: null,
  health: null,
  maxHealth: null,
  points: null,
  posX: null,
  posY: null,
  quantity: null,
  speed: null,
  type: null,

  _initializeMobActive: Ember.on('init', function () {
    this.set('active', true);
  })
});

export default Mob;
