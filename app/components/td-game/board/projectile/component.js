import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: ['inFlight:projectile--in-flight:projectile--default'],

  inFlight: false,

  _destroy() {
    this.set('inFlight', false);

    this.attrs.destroy(this.attrs.id);
  },

  _fetchNewTargetCoords() {
    this.attrs['update-target-coords'](this.attrs.id, this.attrs.mobId);
  },

  _moveToTarget() {
    this._fetchNewTargetCoords();
    this._setPosition(this.attrs.mobX, this.attrs.mobY);

    Ember.run.later(this, () => {
      this._destroy();
    }, 100);
  },

  _setPosition(left, top) {
    this.$().css('position', 'absolute');
    this.$().css('left', left + '%');
    this.$().css('top', top + '%');
  },

  _placeProjectile: Ember.on('didInsertElement', function () {
    this._setPosition(this.attrs.towerX + 1, this.attrs.towerY + 1);
    this.set('inFlight', true);

    Ember.run.later(this, () => {
      this._moveToTarget();
    }, 20);
  })
});
