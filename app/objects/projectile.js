import Ember from 'ember';

const Projectile = Ember.Object.extend({
  id: null,
  class: null,
  endX: null,
  endY: null,
  startX: null,
  startY: null
});

export default Projectile;
