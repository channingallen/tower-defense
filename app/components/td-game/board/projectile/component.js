import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: ['inFlight:projectile--in-flight:projectile--default'],

  inFlight: false,

  targetLeftA: null,

  targetTopA: null,

  _closeInOnTarget2() {
    const targetLeftB = this._getPercentageLeft(this._getTargetLeftPosition());
    const targetTopB = this._getPercentageTop(this._getTargetTopPosition());
    const targetFound = !!targetLeftB && !!targetTopB;

    if (targetFound && !this._targetReached(targetLeftB, targetTopB)) {
      const targetLeftA = this.get('targetLeftA');
      const targetTopA = this.get('targetTopA');

      const targetLeftC = this._getTargetLeftC(targetLeftA, targetLeftB);
      const targetTopC = this._getTargetTopC(targetTopA, targetTopB);

      this._setPosition(targetLeftC, targetTopC);

      this._setTargetPosA();

      Ember.run.later(this, () => {
        this._closeInOnTarget2();
      }, 21);
    } else {
      this.set('inFlight', false);

      this._destroy();
    }
  },

  _destroy() {
    this.set('newTargetCoordsEventCount', 0);

    this.set('inFlight', false);

    this.attrs.destroy(this.attrs.id);
  },

  _fetchNewTargetCoords() {
    this.attrs['update-target-coords'](this.attrs.id, this.attrs.mobId);
  },

  _getDiff(numA, numB) {
    return Math.abs(numA - numB);
  },

  _getNumFromPx(pixels) {
    const valWithoutPct = pixels.split('px')[0];
    return parseInt(valWithoutPct, 10);
  },

  _getPercentageLeft(crudeLeft) {
    if (!crudeLeft) {
      return undefined;
    }

    const left = this._getNumFromPx(crudeLeft);
    const boardWidth = Ember.$('.td-game__board').width();

    return (left / boardWidth) * 100;
  },

  _getPercentageTop(crudeTop) {
    if (!crudeTop) {
      return undefined;
    }

    const top = this._getNumFromPx(crudeTop);
    const boardHeight = Ember.$('.td-game__board').height();

    return (top / boardHeight) * 100;
  },

  _getTargetLeftC(targetLeftA, targetLeftB) {
    if (targetLeftA > targetLeftB) {
      return targetLeftB - (this._getDiff(targetLeftA, targetLeftB) * 10);
    } else {
      return targetLeftB + (this._getDiff(targetLeftA, targetLeftB) * 10);
    }
  },

  _getTargetLeftPosition() {
    return Ember.$(`#${this.attrs.mobId}`).css('left');
  },

  _getTargetTopC(targetTopA, targetTopB) {
    if (targetTopA > targetTopB) {
      return targetTopB - (this._getDiff(targetTopA, targetTopB) * 10);
    } else {
      return targetTopB + (this._getDiff(targetTopA, targetTopB) * 10);
    }
  },

  _getTargetTopPosition() {
    return Ember.$(`#${this.attrs.mobId}`).css('top');
  },

  _setPosition(left, top) {
    this.$().css('left', left + '%');
    this.$().css('top', top + '%');
  },

  _setTargetPosA() {
    const crudeTargetLeftA = this._getTargetLeftPosition();
    const crudeTargetTopA = this._getTargetTopPosition();

    this.set('targetLeftA', this._getPercentageLeft(crudeTargetLeftA));
    this.set('targetTopA', this._getPercentageTop(crudeTargetTopA));
  },

  _targetReached(targetLeft, targetTop) {
    const crudeProjectileLeft = this.$().css('left');
    const crudeProjectileTop = this.$().css('top');

    const projectileLeft = this._getPercentageLeft(crudeProjectileLeft);
    const projectileTop = this._getPercentageTop(crudeProjectileTop);

    var latDiff = Math.abs(projectileLeft - targetLeft);
    var lngDiff = Math.abs(projectileTop - targetTop);

    const totalDiff = latDiff + lngDiff;

    return totalDiff < 2;
  },

  _placeProjectile: Ember.on('didInsertElement', function () {
    this._setPosition(this.attrs.towerX + 1, this.attrs.towerY + 1);

    this.set('inFlight', true);

    this._setTargetPosA();

    Ember.run.later(this, () => {
      this._closeInOnTarget2();
    }, 20);
  }),

  _selfDestructAfterTimeout: Ember.on('didInsertElement', function () {
    Ember.run.later(this, () => {
      if (this.get('inFlight')) {
        this.set('inFlight', false);

        this._destroy();
      }
    }, 400); // determined with respect to 0.3s CSS transition
  }),

  // _updateTargetCoords: Ember.observer(
  //   'inFlight',
  //   'attrs.mobX',
  //   'attrs.mobY',
  //   function () {
  //     if (this.get('inFlight')) {
  //
  //       Ember.run.later(this, () => {
  //         this._closeInOnTarget();
  //       }, 10);
  //     }
  //   }
  // )
});
