import Ember from 'ember';

const Projectile = Ember.Object.extend({
  id: null,
  mobId: null,
  mobX: null,
  mobY: null,
  towerX: null,
  towerY: null
});

export default Projectile;
