import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: ['inFlight:projectile--in-flight:projectile--default'],

  inFlight: false,

  _destroy() {
    this.set('inFlight', false);

    this.attrs.destroy(this.attrs.id);
  },

  _moveToTarget() {
    this._setPosition(this.attrs.mobX1, this.attrs.mobY1);

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
