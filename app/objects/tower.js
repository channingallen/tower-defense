import Ember from 'ember';
import { mobDimensions } from 'tower-defense/objects/mob';

export const towerDimensions = mobDimensions;

const Tower = Ember.Object.extend({
  id: null,
  attackPower: null,
  attackRange: null, // 1-100 (% of board; attackRange / 2 = attack radius)
  posX: null,
  posY: null,
  selector: '.t',
  styles: null,
  targetedMobId: null,
  targetId: null,
  type: null
});

export default Tower;
