import Ember from 'ember';

export default Ember.Component.extend({
  alive: true,

  classNames: ['mob'],

  pathIndex: 0,

  _advancePositionClass() {
    setTimeout(() => {
      if (!this.get('alive')) {
        return;
      }

      const currentIndex = this.get('pathIndex');
      const x = this.attrs.path[currentIndex].get('x');
      const y = this.attrs.path[currentIndex].get('y');

      this.attrs['update-class'](
        this.attrs.mob.get('id'),
        'mob--position-x' + x + ' mob--position-y' + y
      );

      this.set('pathIndex', this.get('pathIndex') + 1);
      if (this.get('pathIndex') < this.get('numPathObjects')) {
        this._advancePositionClass();
      }
    }, this.attrs.speed);
  },

  destroyMob: Ember.observer('attrs.health', function () {
    if (this.attrs.health < 1) {
      this.set('alive', false);

      this.attrs['update-class'](
        this.attrs.mob.get('id'),
        'mob--dead'
      );

      this.attrs['destroy-mob'](this.attrs.mob);
    }
  }),

  initiateMotion: Ember.on('init', function () {
    this._advancePositionClass();
  }),

  numPathObjects: Ember.computed('attrs.path.[]', function () {
    return this.attrs.path.length;
  }),

  pollDOMPosition: Ember.on('init', function () {
    const mobId = this.attrs.mob.get('id');

    const pollPosition = setInterval(() => {
      if (!this.get('alive')) {
        clearInterval(pollPosition);
        return;
      }

      const posLeft = this.$().offset().left;
      const posTop = this.$().offset().top;

      if (posTop && posLeft) {
        this.attrs['update-position'](mobId, 'X', posLeft);
        this.attrs['update-position'](mobId, 'Y', posTop);
      }

      if (!this.get('alive') || this.get('pathIndex') === this.attrs.path.length) {
        clearInterval(pollPosition);
      }
    }, 200);
  }),

  setInitialPositionClass: Ember.on('init', function () {
    const x = this.attrs.path[0].get('x');
    const y = this.attrs.path[0].get('y');

    this.attrs['update-class'](
      this.attrs.mob.get('id'),
      'mob--position-x' + x + ' mob--position-y' + y
    );
  })
});
