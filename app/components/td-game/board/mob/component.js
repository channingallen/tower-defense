import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['mob'],

  healthBarClass: 'mob__health-bar--100',

  mobPathPosition: null,

  nextMobPathPosition: null,

  _getFormattedTransitionSeconds(transitionSeconds) {
    return transitionSeconds.toString() + 's';
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

  _getNumFromPx(pixels) {
    const valWithoutPx = pixels.split('px')[0];
    return parseInt(valWithoutPx, 10);
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

  endPointReached: Ember.computed('pathIndex', function () {
    return this.get('pathIndex') === this.attrs.path.length;
  }),

  numPathObjects: Ember.computed('attrs.path.[]', function () {
    return this.attrs.path.length;
  }),

  _advanceMob: Ember.observer(
    'nextMobPathPosition',
    function() {
      const nextMobPathPosition = this.get('nextMobPathPosition');
      this.set('mobPathPosition', nextMobPathPosition);
      const mobPathPosition = this.get('mobPathPosition');

      const path = this.attrs.path;
      const pathLastIndex = path.get('length') - 1;
      const nextPathCoords = path.get(mobPathPosition);
      const nextLeft = nextPathCoords.get('x');
      const nextTop = nextPathCoords.get('y');

      const transitionSeconds = this._getTransitionSeconds(nextLeft, nextTop);
      const formattedTransitionSeconds = this._getFormattedTransitionSeconds(
        transitionSeconds
      );
      this.$().css('transition', 'all ' + formattedTransitionSeconds + ' linear');
      this.$().css('left', nextLeft + '%');
      this.$().css('top', nextTop + '%');

      if (pathLastIndex >= this.get('nextMobPathPosition') + 1) {
        const transitionMilliseconds = transitionSeconds * 1000;
        this._incrementNextMobPathPosition(transitionMilliseconds);
      }
    }
  ),

  _placeMob: Ember.on('didInsertElement', function () {
    if (this.attrs.path.get('firstObject').get('x') >= 0) {
      this.set('nextMobPathPosition', 0);
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
