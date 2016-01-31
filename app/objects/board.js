import Ember from 'ember';
import { mobDimensions } from 'tower-defense/objects/mob';

export const pathWidth = mobDimensions * 2.42142476633251;

const Board = Ember.Object.extend({
  imageUrl: null,

  pathData: null,

  _initializePathData: Ember.on('init', function () {
    this.set('pathData', Ember.A());
  })
});

export default Board;
