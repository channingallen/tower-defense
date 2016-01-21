import Ember from 'ember';

export default Ember.Component.extend({
  advancing: true,

  classNames: ['mob'],

  healthBarClass: 'mob__health-bar--100',

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
      if (!this.get('advancing')) {
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

  endPointReached: Ember.computed('pathIndex', function () {
    return this.get('pathIndex') === this.attrs.path.length;
  }),

  numPathObjects: Ember.computed('attrs.path.[]', function () {
    return this.attrs.path.length;
  }),

  _destroyMob: Ember.observer('attrs.health', 'pathIndex', function () {
    if (!this.get('advancing')) {
      return;
    }

    const endPointReached = this.get('pathIndex') === this.attrs.path.length;
    if (this.attrs.health < 1 || endPointReached) {
      this.set('advancing', false);

      const styleToAdd = this.attrs.health < 1 ?
                         ' mob--points-added' : ' mob--points-removed';
      this.attrs['update-class'](
        this.attrs.mob.get('id'),
        this.attrs.class + styleToAdd
      );

      const pointAction = endPointReached ? 'subtract-points' : 'add-points';
      this.attrs[pointAction](this.attrs.points);

      Ember.run.later(this, () => {
        this.attrs['update-class'](
          this.attrs.mob.get('id'),
          'mob--dead'
        );

        this.attrs['destroy-mob'](this.attrs.mob);
      }, 2000);
    }
  }),

  _initiateMotion: Ember.on('didInsertElement', function () {
    this._advanceOnePositionClass();

    if (this.get('pathIndex') < this.get('numPathObjects')) {
      Ember.run.later(this, () => {
        this._advanceOnePositionClass();
      }, 200);

      this._advancePositionClasses();
    }
  }),

  _updateHealth: Ember.observer('attrs.health', function () {
    if (!this.get('advancing')) {
      return;
    }

    const maxHealth = this.attrs.mob.get('maxHealth');
    if (this.attrs.health > Math.floor(maxHealth * 0.80)) {
      this.set('healthBarClass', 'mob__health-bar--100');
    } else if (this.attrs.health > Math.floor(maxHealth * 0.60)) {
      this.set('healthBarClass', 'mob__health-bar--80');
    } else if (this.attrs.health > Math.floor(maxHealth * 0.40)) {
      this.set('healthBarClass', 'mob__health-bar--60');
    } else if (this.attrs.health > Math.floor(maxHealth * 0.20)) {
      this.set('healthBarClass', 'mob__health-bar--40');
    } else {
      this.set('healthBarClass', 'mob__health-bar--20');
    }
  }),

  _updatePosition: Ember.on('didInsertElement', function () {
    const mobId = this.attrs.mob.get('id');

    const pollPosition = setInterval(() => {
      if (!this.get('advancing')) {
        clearInterval(pollPosition);
        return;
      }

      const posLeft = this._getPosLeft();
      const posTop = this._getPosTop();
      if (posTop && posLeft) {
        this.attrs['update-position'](mobId, 'X', posLeft);
        this.attrs['update-position'](mobId, 'Y', posTop);
      }

      if (!this.get('advancing') || this.get('pathIndex') === this.attrs.path.length) {
        clearInterval(pollPosition);
      }
    }, 200);
  }),
});
