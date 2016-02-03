import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: ['inFlight:projectile--in-flight:projectile--default'],

  inFlight: false,

  targetLeftA: null,

  targetTopA: null,

  _closeInOnTarget() {
    if (!this.get('inFlight')) {
      return;
    }

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
        // this._setPosition(targetLeftC, targetTopC);

        this._closeInOnTarget();
      }, 21);
    } else {
      // TODO: move mob damage here after improving targetReached() logic
      // this.attrs['damage-mob'](this.attrs.mobId, this.attrs.towerId);

      this.set('inFlight', false);

      this._destroy();
    }
  },

  _destroy() {
    // TODO: after improving targetReached() logic,
    //       only call damage-mob on targetReached()
    this.attrs['damage-mob'](this.attrs.mobId, this.attrs.towerId);

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
      const targetTopC = targetTopB -
                         (this._getDiff(targetTopA, targetTopB) * 10);

      this.set('targetTopC', targetTopC);

      return targetTopC;
    } else {
      const targetTopC = targetTopB +
                         (this._getDiff(targetTopA, targetTopB) * 10);

      this.set('targetTopC', targetTopC);

      return targetTopC;
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
    Ember.run.schedule('afterRender', this, () => {
      this._setPosition(this.attrs.towerX + 1, this.attrs.towerY + 1);

      this.set('inFlight', true);

      this._setTargetPosA();

      Ember.run.later(this, () => {
        this._closeInOnTarget();
      }, 20);
    });
  }),

  _selfDestructAfterTimeout: Ember.on('didInsertElement', function () {
    Ember.run.later(this, () => {
      if (this.get('inFlight')) {
        this.set('inFlight', false);
        this._destroy();
      }
    }, 350); // determined with respect to 0.3s CSS transition
  })
});
