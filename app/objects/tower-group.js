import Ember from 'ember';

export const spaceBetweenTowersPct = 1;

const TowerGroup = Ember.Object.extend({
  id: null,
  groupNum: null,
  numRows: 1,
  posY: 'board__tower-group--position-y0',
  selector: '.t-g',
  styles: null,
  towers: null
});

export default TowerGroup;
