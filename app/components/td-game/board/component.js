import Ember from 'ember';

////////////////
//            //
//   Basics   //
//            //
////////////////

const BoardComponent = Ember.Component.extend({
  classNames: ['td-game__board'],

  _applyBackgroundImage: Ember.on('didInsertElement', Ember.observer(
    'attrs.backgroundImage',
    function () {
      this.$().css('background-image', `url(${this.attrs.backgroundImage})`);
    }
  ))
});

////////////////////
//                //
//   Mob Basics   //
//                //
////////////////////

BoardComponent.reopen({
  mobIndex: 0,

  mobs: []
});

////////////////////////
//                    //
//   Mob Generation   //
//                    //
////////////////////////

BoardComponent.reopen({
  _generateMobs() {
    const mobIndex = this.get('mobIndex');
    const currentMob = this.attrs.waveMobs.objectAt(mobIndex);
    this.get('mobs').addObject(currentMob);

    const anotherMobExists = !!this.attrs.waveMobs.objectAt(mobIndex + 1);
    if (anotherMobExists) {
      this.incrementProperty('mobIndex');

      const mobFrequency = currentMob.get('frequency');
      Ember.run.later(this, this._generateMobs, mobFrequency);
    }
  },

  mobFrequency: Ember.computed('mobIndex', function () {
    const mobIndex = this.get('mobIndex');
    const waveMob = this.attrs.waveMobs[mobIndex];
    return waveMob.get('frequency');
  }),

  kickOffMobGeneration: Ember.observer('attrs.waveStarted', function () {
    if (!this.attrs.waveStarted || !this.attrs.waveMobs.get('length')) {
      this.set('mobIndex', 0);
      this.set('mobs', []);
      return;
    }

    this._generateMobs();
  })
});

//////////////////////////
//                      //
//   Mob Modification   //
//                      //
//////////////////////////

BoardComponent.reopen({
  _reduceMobHealth(mobId, healthToReduce) {
    if (!healthToReduce) {
      healthToReduce = 20;
    }

    this.get('mobs').forEach((mob) => {
      if (mobId === mob.get('id')) {
        const currentHealth = mob.get('health');
        mob.set('health', currentHealth - healthToReduce);
      }
    });
  },

  actions: {
    damageMob(mobId, attackPower) {
      this._reduceMobHealth(mobId, attackPower);
    },

    destroyMob(mob) {
      const mobIndex = this.get('mobs').indexOf(mob);
      this.get('mobs').removeAt(mobIndex);

      mob.set('active', false);
    },

    updateMobClass(mobId, newClass) {
      this.get('mobs').forEach((mob) => {
        if (mobId === mob.get('id')) {
          mob.set('posClass', newClass);
        }
      });
    },

    reportMobPosition(mobId, axis, pos) {
      this.get('mobs').forEach((mob) => {
        if (mobId === mob.get('id')) {
          mob.set('pos' + axis, pos);
        }
      });
    }
  }
});

//////////////////////
//                  //
//   Wave Scoring   //
//                  //
//////////////////////

BoardComponent.reopen({
  wavePoints: 0,

  _getFinalScore: Ember.observer('mobs.@each.active', function () {
    if (!this.get('mobs.length')) {
      this.attrs['score-wave'](this.get('wavePoints'));
    }
  }),

  actions: {
    addPoints(points) {
      const currentWavePoints = this.get('wavePoints');

      if (currentWavePoints + points >= 100) {
        this.set('wavePoints', 100);
      } else {
        this.set('wavePoints', currentWavePoints + points);
      }
    },

    subtractPoints(points) {
      const currentWavePoints = this.get('wavePoints');

      if ((currentWavePoints - points) >= 0) {
        this.set('wavePoints', currentWavePoints - points);
      } else {
        this.set('wavePoints', 0);
      }
    }
  }
});

// TODO: is this reset code necessary?

///////////////
//           //
//   Reset   //
//           //
///////////////

BoardComponent.reopen({
  _resetBoard: Ember.observer('attrs.waveStarted', function () {
    if (!this.attrs.waveStarted) {
      this.set('wavePoints', 0);
    }
  })
});

export default BoardComponent;
