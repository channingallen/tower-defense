import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['mob'],

  pathIndex: 0,

  _advancePositionClass() {
    setTimeout(() => {
      const currentIndex = this.get('pathIndex');
      const x = this.attrs.path[currentIndex].get('x');
      const y = this.attrs.path[currentIndex].get('y');

      this.attrs['update-class'](
        this.attrs.number, // TODO THIS COMMIT: change to ID
        'mob--position-x' + x + 'y' + y
      );

      this.set('pathIndex', this.get('pathIndex') + 1);
      if (this.get('pathIndex') < this.get('numPathObjects')) {
        this._advancePositionClass();
      }
    }, this.attrs.speed);
  },

  initiateMotion: Ember.on('init', function () {
    this._advancePositionClass();
  }),

  numPathObjects: Ember.computed('attrs.path.[]', function () {
    return this.attrs.path.length;
  }),

  pollDOMPosition: Ember.on('init', function () {
    const mobNumber = this.attrs.number; // TODO THIS COMMIT: change to ID

    const pollPosition = setInterval(() => {
      const posLeft = this.$().offset().left;
      const posTop = this.$().offset().top;

      if (posTop && posLeft) {
        this.attrs['update-position'](mobNumber, 'X', posLeft); // TODO THIS COMMIT: ID needed
        this.attrs['update-position'](mobNumber, 'Y', posTop);
      }

      if (this.get('pathIndex') === this.attrs.path.length) {
        clearInterval(pollPosition);
      }
    }, 200);
  }),

  setInitialPositionClass: Ember.on('init', function () {
    const x = this.attrs.path[0].get('x');
    const y = this.attrs.path[0].get('y');

    this.attrs['update-class'](
      this.attrs.number, // TODO THIS COMMIT: change to ID
      'mob--position-x' + x + 'y' + y
    );
  })
});
