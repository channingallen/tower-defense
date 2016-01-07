import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['mob--container'],

  position: null,

  pathIndex: 0,

  _advancePosition() {
    setTimeout(() => {
      const currentIndex = this.get('pathIndex');
      const x = this.attrs.path[currentIndex].get('x');
      const y = this.attrs.path[currentIndex].get('y');
      this.set('position', 'mob--position-x' + x + 'y' + y);

      // iterate index
      this.set('pathIndex', this.get('pathIndex') + 1);

      if (this.get('pathIndex') < this.get('pathLength')) {
        this._advancePosition();
      }
    }, 500);
  },

  updatePosition: Ember.on('init', function () {
    this._advancePosition();
  }),

  setInitialPosition: Ember.on('init', function () {
    const x = this.attrs.path[0].get('x');
    const y = this.attrs.path[0].get('y');
    this.set('position', 'mob--position-x' + x + 'y' + y);
  }),

  pathLength: Ember.computed('attrs.path.[]', function () {
    return this.attrs.path.length;
  })
});
