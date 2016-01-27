import Ember from 'ember';

export default Ember.Component.extend({
  advancing: true,

  classNameBindings: [
    'advancing:mob'
  ],

  endPointReached: false,

  healthBarClass: 'mob__health-bar--100',

  mobPathPosition: null,

  nextMobPathPosition: null,

  _getFormattedTransitionSeconds(transitionSeconds) {
    return transitionSeconds.toString() + 's';
  },

  _getNumFromPx(pixels) {
    const valWithoutPx = pixels.split('px')[0];
    return parseInt(valWithoutPx, 10);
  },

  _getPercentageLeft(crudeLeft) {
    const left = this._getNumFromPx(crudeLeft);
    const boardWidth = this.$().parent().width();
    return (left / boardWidth) * 100;
  },

  _getPercentageTop(crudeTop) {
    const top = this._getNumFromPx(crudeTop);
    const boardHeight = this.$().parent().height();
    return (top / boardHeight) * 100;
  },

  _getTransitionSeconds(nextLeftPctOfTotalWidth, nextTopPctOfTotalHeight) {
    const crudeLeft = this.$().css('left');
    const crudeTop = this.$().css('top');
    if (crudeLeft === 'auto' || crudeTop === 'auto') {
      return 0;
    }

    const leftPctOfTotalWidth = this._getPercentageLeft(crudeLeft);
    const topPctOfTotalHeight = this._getPercentageTop(crudeTop);

    const pctDiff = Math.abs(leftPctOfTotalWidth - nextLeftPctOfTotalWidth) +
                    Math.abs(topPctOfTotalHeight - nextTopPctOfTotalHeight);

    return this.attrs.speed * (pctDiff / 100);
  },

  _incrementNextMobPathPosition(transitionMilliseconds) {
    Ember.run.later(this, () => {
      this.set('nextMobPathPosition', this.get('nextMobPathPosition') + 1);
    }, transitionMilliseconds);
  },

  _sendMobToEndPoint(transitionMilliseconds) {
    Ember.run.later(this, () => {
      if (!this.get('advancing')) {
        return;
      }

      this.set('endPointReached', true);
    }, transitionMilliseconds);
  },

  _updatePosition() {
    const getNextPosition = setInterval(() => {
      if (!this.get('advancing')) {
        clearInterval(getNextPosition);
        return;
      }

      const mobId = this.attrs.mob.get('id');
      const posLeftPct = this._getPercentageLeft(this.$().css('left'));
      const posTopPct = this._getPercentageTop(this.$().css('top'));

      if (posLeftPct && posTopPct) {
        this.attrs['update-position'](mobId, 'X', posLeftPct);
        this.attrs['update-position'](mobId, 'Y', posTopPct);
      }

      if (!this.get('advancing') || this.get('endPointReached')) {
        clearInterval(getNextPosition);
      }
    }, 20);
  },

  numPathObjects: Ember.computed('attrs.path.[]', function () {
    return this.attrs.path.length;
  }),

  _advanceMob: Ember.observer(
    'nextMobPathPosition',
    function() {
      const mobPathPosition = this.get('nextMobPathPosition');
      this.set('mobPathPosition', mobPathPosition);

      const path = this.attrs.path;
      const pathLastIndex = path.get('length') - 1;
      const nextPathCoords = path.get(mobPathPosition);
      const nextLeft = nextPathCoords.get('x'); // % of total width
      const nextTop = nextPathCoords.get('y'); // % of total height

      const transitionSeconds = this._getTransitionSeconds(nextLeft, nextTop);
      const formattedTransitionSeconds = this._getFormattedTransitionSeconds(
        transitionSeconds
      );
      this.$().css('transition', 'all ' + formattedTransitionSeconds + ' linear');
      this.$().css('left', nextLeft + '%');
      this.$().css('top', nextTop + '%');

      const transitionMilliseconds = transitionSeconds * 1000;
      if (pathLastIndex >= this.get('nextMobPathPosition') + 1) {
        this._incrementNextMobPathPosition(transitionMilliseconds);
      } else {
        this._sendMobToEndPoint(transitionMilliseconds);
      }
    }
  ),

  _destroyMob: Ember.observer('attrs.health', 'endPointReached', function () {
    if (!this.get('advancing')) {
      return;
    }

    if (this.attrs.health < 1 || this.get('endPointReached')) {
      this.set('advancing', false);

      const mobId = this.attrs.mob.get('id');
      const died = this.attrs.health < 1;
      const styleToAdd = died ? ' mob--points-added' : ' mob--points-removed';
      this.attrs['update-class'](mobId, this.attrs.class + styleToAdd); // TODO THIS COMMIT: is this attrs.class prefix still necessary?

      const pointAction = this.get('endPointReached') ?
                          'subtract-points' : 'add-points';
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

  _placeMob: Ember.on('didInsertElement', function () {
    if (this.attrs.path.get('firstObject').get('x') >= 0) {
      this.set('nextMobPathPosition', 0);
    }

    this._updatePosition();
  }),

  _resetMob: Ember.observer('attrs.waveStarted', function () {
    if (!this.attrs.waveStarted) {
      this.set('advancing', true);
      this.set('endPointReached', false);
      this.set('healthBarClass', 'mob__health-bar--100');
      this.set('mobPathPosition', null);
      this.set('nextMobPathPosition', null);
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
  })
});
