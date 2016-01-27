import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: ['inFlight:projectile--in-flight:projectile--default'],

  inFlight: false,

  _closeInOnTarget() {
    if (!this._targetReached()) {
      this._setPosition(this.attrs.mobX, this.attrs.mobY); // takes 200 milliseconds

      this._fetchNewTargetCoords();
    } else {
      this.set('inFlight', false);

      this._destroy();
    }
  },

  _destroy() {
    this.set('inFlight', false);

    this.attrs.destroy(this.attrs.id);
  },

  _fetchNewTargetCoords() {
    this.attrs['update-target-coords'](this.attrs.id, this.attrs.mobId);
  },

  _getNumFromPx(pixels) {
    const valWithoutPct = pixels.split('px')[0];
    return parseInt(valWithoutPct, 10);
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

  _setPosition(left, top) {
    this.$().css('position', 'absolute');
    this.$().css('left', left + '%');
    this.$().css('top', top + '%');
  },

  _targetReached() {
    const crudeLeft = this.$().css('left');
    const crudeTop = this.$().css('top');

    const leftPctOfTotalWidth = this._getPercentageLeft(crudeLeft);
    const topPctOfTotalHeight = this._getPercentageTop(crudeTop);

    var latDiff = Math.abs(leftPctOfTotalWidth - this.attrs.mobX);
    var lngDiff = Math.abs(topPctOfTotalHeight - this.attrs.mobY);

    const totalDiff = latDiff + lngDiff;

    return totalDiff < 1;
  },

  _placeProjectile: Ember.on('didInsertElement', function () {
    this._setPosition(this.attrs.towerX + 1, this.attrs.towerY + 1);

    this.set('inFlight', true);
  }),

  _selfDestructAfterTimeout: Ember.on('didInsertElement', function () {
    Ember.run.later(this, () => {
      if (this.get('inFlight')) {
        this.set('inFlight', false);

        this._destroy();
      }
    }, 350); // determined with respect to 0.3s CSS transition
  }),

  _updateTargetCoords: Ember.observer(
    'inFlight',
    'attrs.mobX',
    'attrs.mobY',
    function () {
      if (this.get('inFlight')) {
        Ember.run.later(this, () => {
          this._closeInOnTarget();
        }, 20);
      }
    }
  )
});
