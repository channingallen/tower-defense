import Ember from 'ember';

const TowerGroup = Ember.Object.extend({
  id: null,
  numRows: 1,
  posY: 'board__tower-group--position-y0',
  selector: '.t-g',
  styles: null,
  towers: null
});

export default TowerGroup;
