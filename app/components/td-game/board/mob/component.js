import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['mob--container'],

  pathIndex: 0,

  position: null,

  _advancePosition() {
    setTimeout(() => {
      const currentIndex = this.get('pathIndex');
      const x = this.attrs.path[currentIndex].get('x');
      const y = this.attrs.path[currentIndex].get('y');
      this.set('position', 'mob--position-x' + x + 'y' + y);

      this.set('pathIndex', this.get('pathIndex') + 1);
      if (this.get('pathIndex') < this.get('numPathObjects')) {
        this._advancePosition();
      }
    }, this.attrs.speed);
  },

  numPathObjects: Ember.computed('attrs.path.[]', function () {
    return this.attrs.path.length;
  }),

  setInitialPosition: Ember.on('init', function () {
    const x = this.attrs.path[0].get('x');
    const y = this.attrs.path[0].get('y');
    this.set('position', 'mob--position-x' + x + 'y' + y);
  }),

  updatePosition: Ember.on('init', function () {
    this._advancePosition();
  })
});
