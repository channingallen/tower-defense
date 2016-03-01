import Ember from 'ember';

////////////////
//            //
//   Basics   //
//            //
////////////////

const ProjectileComponent = Ember.Component.extend({
  classNameBindings: ['attrs.upgraded:projectile--upgraded:projectile--standard'],

  classNames: ['tower__projectile'],

  _applyBackgroundImage: Ember.on('didInsertElement', Ember.observer(
    'attrs.backgroundImage',
    function () {
      this.$().css('background-image', `url('/images/explosion.gif')`);
    }
  ))
});

/////////////////////
//                 //
//   Positioning   //
//                 //
/////////////////////

ProjectileComponent.reopen({
  _positionProjectileOnMob: Ember.on('didInsertElement', function () {
    Ember.run.schedule('afterRender', this, () => {
      const targetPosX = this.attrs.targetPosX;
      const targetPosY = this.attrs.targetPosY;
      this.$().css('left', `${targetPosX - 2}%`);
      this.$().css('top', `${targetPosY - 1}%`);

      this.attrs['damage-mob'](this.attrs.targetId, this.attrs.attackPower);

      Ember.run.later(this, () => {
        this._destroy();
      }, 300);
    });
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
