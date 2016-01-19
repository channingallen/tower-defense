import Ember from 'ember';

const Tower = Ember.Object.extend({
  id: null,
  attackPower: null,
  attackRange: null, // 1-100 (% of board; attackRange / 2 = attack radius)
  posX: null,
  posY: null,
  selector: '.t',
  styles: null,
  targetedMobId: null,
  type: null
});

export default Tower;
