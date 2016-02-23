import Ember from 'ember';

////////////////
//            //
//   Basics   //
//            //
////////////////

const ProjectileComponent = Ember.Component.extend({
  classNameBindings: ['inFlight:projectile--in-flight:projectile--default'],

  inFlight: false
});

/////////////////////
//                 //
//   Positioning   //
//                 //
/////////////////////

ProjectileComponent.reopen({
  _setPosition(left, top) {
    this.$().css('left', left + '%');
    this.$().css('top', top + '%');
  },

  _positionProjectileOnMob: Ember.on('didInsertElement', function () {
    Ember.run.schedule('afterRender', this, () => {
      this.set('inFlight', true);

      this._setPosition(this.attrs.mobX, this.attrs.mobY);

      this.attrs['damage-mob'](this.attrs.mobId, this.attrs.towerId);

      Ember.run.later(this, () => {
        this._destroy();
      }, 500);
    });
  })
});

//////////////////
//              //
//   Shrapnel   //
//              //
//////////////////

ProjectileComponent.reopen({
  particulates: [],

  addParticulates: Ember.on('didInsertElement', function () {
    for (let i = 0; i < 50; i++) {
      this.get('particulates').addObject(i);
    }
  })
});

/////////////////////
//                 //
//   Termination   //
//                 //
/////////////////////

ProjectileComponent.reopen({
  _destroy() {
    this.set('inFlight', false);

    this.attrs.destroy(this.attrs.id);
  }
});

export default ProjectileComponent;
