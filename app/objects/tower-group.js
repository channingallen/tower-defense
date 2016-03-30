import Ember from 'ember';

export const spaceBetweenTowersPct = 1;

const TowerGroup = Ember.Object.extend({
  id: null,
  flexDirectionAllowed: null,
  groupNum: null,
  numRows: 1,
  posY: 'board__tower-group--position-y0',
  selector: '.t-g',
  styles: null,
  towers: null,

  _initializeFlexDirectionDisallowed: Ember.on('init', function () {
    this.set('flexDirectionAllowed', false);
  })
});


export default TowerGroup;
