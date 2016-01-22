import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['projectile'],

  _moveToTarget() {
    Ember.run.later(this, () => {
      this.$().css('left', this.attrs.endX + '%');
      this.$().css('top', this.attrs.endY + '%');
    }, 100);
  },

  _placeProjectile: Ember.on('didInsertElement', function () {
    this.$().css('left', this.attrs.startX + '%');
    this.$().css('top', this.attrs.startY + '%');

    this._moveToTarget();
  })
});
