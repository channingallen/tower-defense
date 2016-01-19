import Ember from 'ember';

const Tower = Ember.Object.extend({
  id: null,
  posX: null,
  posY: null,
  selector: '.t',
  styles: null,
  targetedMobId: null,
  type: null
});

export default Tower;
