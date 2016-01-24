import Ember from 'ember';

const Board = Ember.Object.extend({
  imageUrl: null,

  pathData: null,

  _initializePathData: Ember.on('init', function () {
    this.set('pathData', Ember.A());
  })
});

export default Board;
