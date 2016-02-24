import Ember from 'ember';

////////////////
//            //
//   Basics   //
//            //
////////////////

const ProjectileComponent = Ember.Component.extend({
  classNameBindings: ['inFlight:projectile--in-flight:projectile--default'],

  classNames: ['tower__projectile'],

  // inFlight: false
});

/////////////////////
//                 //
//   Positioning   //
//                 //
/////////////////////

ProjectileComponent.reopen({
  _positionProjectileOnMob: Ember.on('didInsertElement', function () {
    Ember.run.schedule('afterRender', this, () => {
      this.set('inFlight', true);

      const targetPosX = this.attrs.targetPosX;
      const targetPosY = this.attrs.targetPosY;
      this.$().css('left', `${targetPosX}%`);
      this.$().css('top', `${targetPosY}%`);

      this.attrs['damage-mob'](this.attrs.targetId, this.attrs.attackPower);

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
    this.attrs.destroy(this.attrs.projectileId, this.attrs.targetId);
  }
});

export default ProjectileComponent;
