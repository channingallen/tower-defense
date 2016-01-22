import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: ['inFlight:projectile--in-flight:projectile--default'],

  inFlight: false,

  _destroy() {
    this.forceSet('inFlight', false);

    this.attrs.destroy(this.attrs.id);
  },

  _moveToTarget() {
    this._setPosition(this.attrs.endX, this.attrs.endY);

    Ember.run.later(this, () => {
      this._destroy();
    }, 20);
  },

  _setPosition(left, top) {
    this.$().css('position', 'absolute');
    this.$().css('left', left + '%');
    this.$().css('top', top + '%');
  },

  _placeProjectile: Ember.on('didInsertElement', function () {
    this._setPosition(this.attrs.startX + 1, this.attrs.startY + 1);
    this.forceSet('inFlight', true);

    Ember.run.later(this, () => {
      this._moveToTarget();
    }, 20);
  })
});
