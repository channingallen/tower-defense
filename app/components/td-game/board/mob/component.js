import Ember from 'ember';

export default Ember.Component.extend({
  alive: true,

  classNames: ['mob'],

  pathIndex: 0,

  _advanceOnePositionClass() {
    const currentIndex = this.get('pathIndex');
    const x = this.attrs.path[currentIndex].get('x');
    const y = this.attrs.path[currentIndex].get('y');

    this.attrs['update-class'](
      this.attrs.mob.get('id'),
      'mob--position-x' + x + ' mob--position-y' + y
    );

    this.set('pathIndex', this.get('pathIndex') + 1);
  },

  _advancePositionClasses() {
    Ember.run.later(this, () => {
      if (!this.get('alive')) {
        return;
      }

      this._advanceOnePositionClass();
      if (this.get('pathIndex') < this.get('numPathObjects')) {
        this._advancePositionClasses();
      }
    }, this.attrs.speed);
  },

  _getPosLeft() {
    const $board = Ember.$('.td-game__board');
    const $mob = this.$();

    const $boardDistanceFromLeft = $board.offset().left;
    const $mobDistanceFromLeft = $mob.offset().left;

    const $mobDistanceFromBoardLeft = Math.abs(
      $boardDistanceFromLeft - $mobDistanceFromLeft
    );

    const $boardLength = $board.innerHeight(); // height & width
    return Math.floor(100 * ($mobDistanceFromBoardLeft / $boardLength));
  },

  _getPosTop() {
    const $board = Ember.$('.td-game__board');
    const $mob = this.$();

    const $boardDistanceFromTop = $board.offset().top;
    const $mobDistanceFromTop = $mob.offset().top;

    const $mobDistanceFromBoardTop = Math.abs(
      $boardDistanceFromTop - $mobDistanceFromTop
    );

    const $boardLength = $board.innerHeight(); // height & width
    return Math.floor(100 * ($mobDistanceFromBoardTop / $boardLength));
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

  initiateMotion: Ember.on('didInsertElement', function () {
    this._advanceOnePositionClass();

    if (this.get('pathIndex') < this.get('numPathObjects')) {
      Ember.run.later(this, () => {
        this._advanceOnePositionClass();
      }, 200);

      this._advancePositionClasses();
    }
  }),

  numPathObjects: Ember.computed('attrs.path.[]', function () {
    return this.attrs.path.length;
  }),

  pollDOMPosition: Ember.on('didInsertElement', function () {
    const mobId = this.attrs.mob.get('id');

    const pollPosition = setInterval(() => {
      if (!this.get('alive')) {
        clearInterval(pollPosition);
        return;
      }

      const posLeft = this._getPosLeft();
      const posTop = this._getPosTop();
      if (posTop && posLeft) {
        this.attrs['update-position'](mobId, 'X', posLeft);
        this.attrs['update-position'](mobId, 'Y', posTop);
      }

      if (!this.get('alive') || this.get('pathIndex') === this.attrs.path.length) {
        clearInterval(pollPosition);
      }
    }, 200);
  })
});
